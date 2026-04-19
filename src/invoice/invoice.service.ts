import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entities';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ClientService } from '../client/client.service';
import { User } from '../auth/entities/user.entity';
import dayjs from 'dayjs';
import {
  extractPublicIdFromUrl,
  generateAndUploadPdf,
  transformInvoiceWithUrls,
} from './utils/helper.utils';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    private cloudinaryService: CloudinaryService,
    private clientService: ClientService,
  ) {}

  async create(dto: CreateInvoiceDto, user: User) {
    // Fetch client owned by this user
    const client = await this.clientService.findOne(dto.clientId, user.id);

    const issueDate = dayjs(dto.month).endOf('month').toDate();
    const dueDate = dayjs(issueDate)
      .add(user.defaultPaymentTermsDays, 'day')
      .toDate();

    // Get last invoice for this user to generate next number
    const invoices = await this.invoiceRepository.find({
      where: { user: { id: user.id } },
      order: { invoiceNumber: 'DESC' },
      take: 1,
    });

    const lastInvoice = invoices.length > 0 ? invoices[0] : null;
    const nextNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 1;

    const invoiceData = {
      invoiceNumber: nextNumber,
      month: dto.month,
      issueDate,
      dueDate,
      amount: dto.amount,
      currency: dto.currency || user.defaultCurrency,
      taxPercentage: dto.taxPercentage,
      notes: dto.notes,
      user,
      client,
    };

    const invoice = this.invoiceRepository.create(invoiceData);
    await this.invoiceRepository.save(invoice);

    try {
      invoice.pdfPath = await generateAndUploadPdf(
        invoice,
        user,
        this.cloudinaryService,
      );
      await this.invoiceRepository.save(invoice);
    } catch (error) {
      await this.invoiceRepository.remove(invoice);
      throw new BadRequestException(
        `Failed to generate PDF: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    return this.findOne(invoice.id, user.id);
  }

  async findAll(
    page: number,
    limit: number,
    user: User,
    search?: string,
    month?: string,
  ) {
    const query = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.client', 'client')
      .where('invoice.user.id = :userId', { userId: user.id });

    if (search) {
      query.andWhere('client.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (month) {
      query.andWhere('invoice.month = :month', { month });
    }

    query.orderBy('invoice.invoiceNumber', 'DESC');

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const transformedData = data.map((invoice) =>
      transformInvoiceWithUrls(invoice),
    );

    return {
      data: transformedData,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, userId: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'client'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return transformInvoiceWithUrls(invoice);
  }

  async remove(id: string, userId: string) {
    const invoice = await this.findOne(id, userId);

    if (invoice.pdfPath) {
      try {
        const publicId = extractPublicIdFromUrl(invoice.pdfPath);
        if (publicId) {
          await this.cloudinaryService.deleteFile(publicId);
        }
      } catch (error) {
        console.error('Error deleting PDF from Cloudinary:', error);
      }
    }

    await this.invoiceRepository.remove(invoice);

    return {
      message: `Invoice #${invoice.invoiceNumber} deleted successfully`,
    };
  }
}
