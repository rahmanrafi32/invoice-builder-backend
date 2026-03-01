import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entities';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
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
  ) {}

  async create(dto: CreateInvoiceDto) {
    const issueDate = dayjs(dto.month).endOf('month').toDate();
    const dueDate = dayjs(issueDate).add(7, 'day').toDate();

    const invoices = await this.invoiceRepository.find({
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
      clientName: 'Infarsight FZ LLC',
    };

    const invoice: Invoice = this.invoiceRepository.create(invoiceData);
    await this.invoiceRepository.save(invoice);

    invoice.pdfPath = await generateAndUploadPdf(
      invoice,
      this.cloudinaryService,
    );

    await this.invoiceRepository.save(invoice);

    return invoice;
  }

  async findAll(page: number, limit: number, search?: string, month?: string) {
    const query = this.invoiceRepository.createQueryBuilder('invoice');

    if (search) {
      query.andWhere('invoice.clientName ILIKE :search', {
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

  async findOne(id: string) {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return transformInvoiceWithUrls(invoice);
  }

  async remove(id: string) {
    const invoice = await this.findOne(id);

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
