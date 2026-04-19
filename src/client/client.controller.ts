import {
  Controller,
  Post,
  Get,
  Put,
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
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { User } from '../auth/entities/user.entity';

@ApiTags('Clients')
@Controller('clients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new client',
    description: 'Add a new client/recipient to your account',
  })
  @ApiResponse({
    status: 201,
    description: 'Client created successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        address: '456 Business Boulevard',
        city: 'Los Angeles',
        country: 'USA',
        createdAt: '2025-04-18T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  create(@Body() dto: CreateClientDto, @CurrentUser() user: User) {
    return this.clientService.create(dto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all clients',
    description: 'Retrieve list of all your clients with pagination and search',
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
    description: 'Search clients by name',
    example: 'Acme',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Clients retrieved successfully',
    schema: {
      example: {
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Acme Corporation',
            email: 'contact@acme.com',
          },
        ],
        total: 5,
        page: 1,
        limit: 10,
      },
    },
  })
  findAll(
    @CurrentUser() user: User,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.clientService.findAll(
      Number(page),
      Number(limit),
      user,
      search,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get client by ID',
    description: 'Retrieve detailed information about a specific client',
  })
  @ApiParam({
    name: 'id',
    description: 'Client UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Client details retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.clientService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update client',
    description: 'Update client information',
  })
  @ApiParam({
    name: 'id',
    description: 'Client UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'Client updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
    @CurrentUser() user: User,
  ) {
    return this.clientService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete/Archive client',
    description: 'Archive a client (soft delete - preserves invoice history)',
  })
  @ApiParam({
    name: 'id',
    description: 'Client UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'Client archived successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.clientService.remove(id, user.id);
  }
}
