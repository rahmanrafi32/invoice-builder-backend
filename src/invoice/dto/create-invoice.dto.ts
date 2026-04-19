import { IsNumber, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'Client UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  clientId: string;

  @ApiProperty({
    description: 'Invoice amount',
    example: 5000,
    type: 'number',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Invoice month (YYYY-MM-DD format)',
    example: '2025-04-01',
  })
  @IsString()
  month: string;

  @ApiPropertyOptional({
    description: 'Currency code (ISO 4217)',
    example: 'USD',
    default: 'USD',
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({
    description: 'Tax percentage',
    example: 10,
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  taxPercentage?: number;

  @ApiPropertyOptional({
    description: 'Additional notes or invoice description',
    example: 'Professional consulting services for Q1 2025',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
