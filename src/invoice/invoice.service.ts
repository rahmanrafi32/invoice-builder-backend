import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

    // Invalidate invoices list cache
    await this.cacheManager.del(`invoices_list_${user.id}`);

    return this.findOne(invoice.id, user.id);
  }

  async findAll(
    page: number,
    limit: number,
    user: User,
    search?: string,
    month?: string,
  ) {
    const cacheKey = `invoices_list_${user.id}_page_${page}_limit_${limit}_search_${search || 'all'}_month_${month || 'all'}`;
    const cachedResult = await this.cacheManager.get<object>(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

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

    const result = {
      data: transformedData,
      total,
      page,
      limit,
    };

    await this.cacheManager.set(cacheKey, result);

    return result;
  }

  async findOne(id: string, userId: string) {
    const cacheKey = `invoice_${id}_user_${userId}`;
    const cachedInvoice = await this.cacheManager.get<object>(cacheKey);

    if (cachedInvoice) {
      return cachedInvoice;
    }

    const invoice = await this.invoiceRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'client'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    const transformedInvoice = transformInvoiceWithUrls(invoice);
    await this.cacheManager.set(cacheKey, transformedInvoice);

    return transformedInvoice;
  }

  async remove(id: string, userId: string) {
    const invoice = await this.findOne(id, userId);

    // Get the raw invoice entity for property access
    const rawInvoice = await this.invoiceRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (rawInvoice?.pdfPath) {
      try {
        const publicId = extractPublicIdFromUrl(rawInvoice.pdfPath);
        if (publicId) {
          await this.cloudinaryService.deleteFile(publicId);
        }
      } catch (error) {
        console.error('Error deleting PDF from Cloudinary:', error);
      }
    }

    if (rawInvoice) {
      await this.invoiceRepository.remove(rawInvoice);
    }

    // Invalidate caches
    await this.cacheManager.del(`invoice_${id}_user_${userId}`);
    await this.cacheManager.del(`invoices_list_${userId}`);

    // Get invoice number from the cached/transformed invoice for the response
    const invoiceData = invoice as unknown as { invoiceNumber: number };

    return {
      message: `Invoice #${invoiceData.invoiceNumber} deleted successfully`,
    };
  }
}
