import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { User } from '../auth/entities/user.entity';

@ApiTags('Invoices')
@Controller('invoices')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new invoice',
    description:
      'Create a new invoice for a client. PDF is automatically generated and uploaded to Cloudinary',
  })
  @ApiResponse({
    status: 201,
    description: 'Invoice created successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        invoiceNumber: 1,
        clientId: '550e8400-e29b-41d4-a716-446655440001',
        amount: '5000.00',
        month: '2025-04-01',
        issueDate: '2025-04-30',
        dueDate: '2025-05-07',
        pdfPath: 'https://res.cloudinary.com/...',
        pdfPreviewUrl: 'https://res.cloudinary.com/...',
        pdfDownloadUrl: 'https://res.cloudinary.com/...',
        createdAt: '2025-04-18T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or client not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  create(@Body() dto: CreateInvoiceDto, @CurrentUser() user: User) {
    return this.invoiceService.create(dto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all invoices',
    description:
      'Retrieve list of all your invoices with pagination, search, and filtering by month',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @ApiQuery({
    name: 'search',
    description: 'Search invoices by client name',
    example: 'Acme',
    required: false,
  })
  @ApiQuery({
    name: 'month',
    description: 'Filter by invoice month (YYYY-MM-DD)',
    example: '2025-04-01',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Invoices retrieved successfully',
    schema: {
      example: {
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            invoiceNumber: 1,
            amount: '5000.00',
            clientName: 'Acme Corp',
          },
        ],
        total: 15,
        page: 1,
        limit: 10,
      },
    },
  })
  findAll(
    @CurrentUser() user: User,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('month') month?: string,
  ) {
    return this.invoiceService.findAll(
      Number(page),
      Number(limit),
      user,
      search,
      month,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get invoice by ID',
    description: 'Retrieve detailed information about a specific invoice',
  })
  @ApiParam({
    name: 'id',
    description: 'Invoice UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Invoice details retrieved successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        invoiceNumber: 1,
        amount: '5000.00',
        pdfDownloadUrl: 'https://res.cloudinary.com/...',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.invoiceService.findOne(id, user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete invoice',
    description: 'Delete an invoice and its associated PDF from Cloudinary',
  })
  @ApiParam({
    name: 'id',
    description: 'Invoice UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'Invoice deleted successfully',
    schema: {
      example: {
        message: 'Invoice #1 deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found',
  })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.invoiceService.remove(id, user.id);
  }
}
