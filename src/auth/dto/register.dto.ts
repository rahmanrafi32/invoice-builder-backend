import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'SecurePass123!',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  // Sender Details
  @ApiProperty({
    description: 'Sender/company name',
    example: 'John Doe',
  })
  @IsString()
  senderName: string;

  @ApiProperty({
    description: 'Sender email address',
    example: 'john@company.com',
  })
  @IsEmail()
  senderEmail: string;

  @ApiPropertyOptional({
    description: 'Sender phone number',
    example: '+1-555-0123',
  })
  @IsString()
  @IsOptional()
  senderPhone?: string;

  @ApiProperty({
    description: 'Sender street address',
    example: '123 Main Street, Suite 100',
  })
  @IsString()
  senderAddress: string;

  @ApiPropertyOptional({
    description: 'Sender city',
    example: 'New York',
  })
  @IsString()
  @IsOptional()
  senderCity?: string;

  @ApiPropertyOptional({
    description: 'Sender country',
    example: 'USA',
  })
  @IsString()
  @IsOptional()
  senderCountry?: string;

  @ApiPropertyOptional({
    description: 'Sender tax ID',
    example: '12-3456789',
  })
  @IsString()
  @IsOptional()
  senderTaxId?: string;

  // Bank Details
  @ApiProperty({
    description: 'Bank name',
    example: 'Chase Bank',
  })
  @IsString()
  bankName: string;

  @ApiProperty({
    description: 'Bank account number',
    example: '9876543210',
  })
  @IsString()
  accountNumber: string;

  @ApiProperty({
    description: 'Account holder name',
    example: 'John Doe',
  })
  @IsString()
  accountHolderName: string;

  @ApiPropertyOptional({
    description: 'Bank routing code',
    example: '021000021',
  })
  @IsString()
  @IsOptional()
  routingCode?: string;

  @ApiPropertyOptional({
    description: 'Bank SWIFT code',
    example: 'CHASUS33',
  })
  @IsString()
  @IsOptional()
  swiftCode?: string;

  @ApiPropertyOptional({
    description: 'Bank branch name',
    example: 'Main Branch',
  })
  @IsString()
  @IsOptional()
  branchName?: string;

  // Invoice Settings
  @ApiPropertyOptional({
    description: 'Invoice prefix (e.g., INV, INVOICE)',
    example: 'INV',
    default: 'INV',
  })
  @IsString()
  @IsOptional()
  invoicePrefix?: string;

  @ApiPropertyOptional({
    description: 'Default currency for invoices',
    example: 'USD',
    default: 'USD',
  })
  @IsString()
  @IsOptional()
  defaultCurrency?: string;

  @ApiPropertyOptional({
    description: 'Default payment terms in days',
    example: 7,
    default: 7,
  })
  @IsOptional()
  defaultPaymentTermsDays?: number;
}
