import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({
    description: 'Client company name',
    example: 'Acme Corporation',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Client email address',
    example: 'contact@acme.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Client phone number',
    example: '+1-555-0123',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Client street address',
    example: '456 Business Boulevard, Floor 5',
  })
  @IsString()
  address: string;

  @ApiPropertyOptional({
    description: 'Client city',
    example: 'Los Angeles',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({
    description: 'Client country',
    example: 'USA',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    description: 'Client tax ID',
    example: '12-3456789',
  })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiPropertyOptional({
    description: 'Client website',
    example: 'https://acme.com',
  })
  @IsString()
  @IsOptional()
  website?: string;
}
