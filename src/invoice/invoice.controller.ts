import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() dto: CreateInvoiceDto) {
    return this.invoiceService.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 5,
    @Query('search') search?: string,
    @Query('month') month?: string,
  ) {
    return this.invoiceService.findAll(
      Number(page),
      Number(limit),
      search,
      month,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoiceService.remove(id);
  }
}
