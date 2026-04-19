import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Create a new user account with profile details, company info, and bank information. Returns JWT access and refresh tokens. Password must be strong (min 8 chars, uppercase, lowercase, number, special char).',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE2MTYyMzkwMjIsImV4cCI6MTYxNjIzOTkwMn0...',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE2MTYyMzkwMjIsImV4cCI6MTYxNjMyNTQyMn0...',
        expires_in: '15m',
        token_type: 'Bearer',
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'john@example.com',
          name: 'John Doe',
          senderName: 'John Doe',
          senderEmail: 'john@example.com',
          senderPhone: '+1234567890',
          senderAddress: '123 Main St',
          senderCity: 'New York',
          senderCountry: 'USA',
          senderTaxId: 'XX-XXXXXXX',
          bankName: 'Chase Bank',
          accountNumber: '123456789',
          accountHolderName: 'John Doe',
          routingCode: '021000021',
          swiftCode: 'CHASUS33',
          branchName: 'Main Branch',
          invoicePrefix: 'INV',
          defaultCurrency: 'USD',
          defaultPaymentTermsDays: 7,
          isActive: true,
          createdAt: '2026-04-19T10:00:00Z',
          updatedAt: '2026-04-19T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input, email already exists, or weak password',
    schema: {
      examples: {
        emailExists: {
          value: {
            statusCode: 400,
            message: 'Email already registered',
            error: 'Bad Request',
          },
        },
        weakPassword: {
          value: {
            statusCode: 400,
            message: 'Invalid password',
            errors: [
              'Password must be at least 8 characters',
              'Password must contain at least one uppercase letter',
              'Password must contain at least one special character (!@#$%^&*)',
            ],
          },
        },
      },
    },
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate with email and password to get JWT access and refresh tokens.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE2MTYyMzkwMjIsImV4cCI6MTYxNjIzOTkwMn0...',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE2MTYyMzkwMjIsImV4cCI6MTYxNjMyNTQyMn0...',
        expires_in: '15m',
        token_type: 'Bearer',
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'john@example.com',
          name: 'John Doe',
          senderName: 'John Doe',
          senderEmail: 'john@example.com',
          senderPhone: '+1234567890',
          senderAddress: '123 Main St',
          senderCity: 'New York',
          senderCountry: 'USA',
          senderTaxId: 'XX-XXXXXXX',
          bankName: 'Chase Bank',
          accountNumber: '123456789',
          accountHolderName: 'John Doe',
          routingCode: '021000021',
          swiftCode: 'CHASUS33',
          branchName: 'Main Branch',
          invoicePrefix: 'INV',
          defaultCurrency: 'USD',
          defaultPaymentTermsDays: 7,
          isActive: true,
          createdAt: '2026-04-19T10:00:00Z',
          updatedAt: '2026-04-19T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid email or password',
        error: 'Unauthorized',
      },
    },
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Use a valid refresh token to obtain a new access token. Returns new tokens with rotated refresh token.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh_token: {
          type: 'string',
          description:
            'The refresh token obtained from login or register endpoint',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE2MTYyMzkwMjIsImV4cCI6MTYxNjMyNTQyMn0...',
        },
      },
      required: ['refresh_token'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'New tokens generated successfully',
    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE2MTYyNDAwMjIsImV4cCI6MTYxNjI0MDkwMn0...',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE2MTYyNDAwMjIsImV4cCI6MTYxNjMyNjQyMn0...',
        expires_in: '15m',
        token_type: 'Bearer',
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'john@example.com',
          name: 'John Doe',
          senderName: 'John Doe',
          senderEmail: 'john@example.com',
          senderPhone: '+1234567890',
          senderAddress: '123 Main St',
          senderCity: 'New York',
          senderCountry: 'USA',
          senderTaxId: 'XX-XXXXXXX',
          bankName: 'Chase Bank',
          accountNumber: '123456789',
          accountHolderName: 'John Doe',
          routingCode: '021000021',
          swiftCode: 'CHASUS33',
          branchName: 'Main Branch',
          invoicePrefix: 'INV',
          defaultCurrency: 'USD',
          defaultPaymentTermsDays: 7,
          isActive: true,
          createdAt: '2026-04-19T10:00:00Z',
          updatedAt: '2026-04-19T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid refresh token',
        error: 'Unauthorized',
      },
    },
  })
  refreshToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'Logout user',
    description: 'Invalidate the refresh token and logout the user',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out',
    schema: {
      example: {
        message: 'Logged out successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'Get user profile',
    description:
      'Retrieve current logged-in user profile with all company and bank details',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'john@example.com',
        name: 'John Doe',
        senderName: 'John Doe',
        senderEmail: 'john@example.com',
        senderPhone: '+1234567890',
        senderAddress: '123 Main St',
        senderCity: 'New York',
        senderCountry: 'USA',
        senderTaxId: 'XX-XXXXXXX',
        bankName: 'Chase Bank',
        accountNumber: '123456789',
        accountHolderName: 'John Doe',
        routingCode: '021000021',
        swiftCode: 'CHASUS33',
        branchName: 'Main Branch',
        invoicePrefix: 'INV',
        defaultCurrency: 'USD',
        defaultPaymentTermsDays: 7,
        isActive: true,
        createdAt: '2026-04-19T10:00:00Z',
        updatedAt: '2026-04-19T10:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
  })
  getProfile(@CurrentUser() user: User) {
    const { password, refreshToken, refreshTokenExpiresAt, ...rest } = user;
    return rest;
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'Update user profile',
    description:
      'Update user profile and company details. Email cannot be changed. Password must be strong if updated (min 8 chars, uppercase, lowercase, number, special char).',
  })
  @ApiBody({
    type: UpdateProfileDto,
    description:
      'Update any fields except email. Password must meet security requirements.',
    examples: {
      example1: {
        summary: 'Update personal info',
        value: {
          name: 'Jane Doe',
          password: 'NewPassword123!',
        },
      },
      example2: {
        summary: 'Update company details',
        value: {
          senderName: 'Jane Doe Business',
          senderPhone: '+9876543210',
          senderAddress: '456 Oak Ave',
        },
      },
      example3: {
        summary: 'Update bank details',
        value: {
          bankName: 'Bank of America',
          accountNumber: '987654321',
          accountHolderName: 'Jane Doe',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'john@example.com',
        name: 'Jane Doe',
        senderName: 'Jane Doe Business',
        senderEmail: 'john@example.com',
        senderPhone: '+9876543210',
        senderAddress: '456 Oak Ave',
        senderCity: 'Los Angeles',
        senderCountry: 'USA',
        senderTaxId: 'XX-XXXXXXX',
        bankName: 'Bank of America',
        accountNumber: '987654321',
        accountHolderName: 'Jane Doe',
        routingCode: '021000021',
        swiftCode: 'BOFAUS3N',
        branchName: 'Main Branch',
        invoicePrefix: 'INV',
        defaultCurrency: 'USD',
        defaultPaymentTermsDays: 14,
        isActive: true,
        createdAt: '2026-04-19T10:00:00Z',
        updatedAt: '2026-04-19T15:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - email update attempted, invalid input, or weak password',
    schema: {
      examples: {
        emailChange: {
          value: {
            statusCode: 400,
            message: 'Email cannot be updated',
            error: 'Bad Request',
          },
        },
        weakPassword: {
          value: {
            statusCode: 400,
            message: 'Invalid password',
            errors: [
              'Password must be at least 8 characters',
              'Password must contain at least one special character (!@#$%^&*)',
            ],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(user.id, dto);
  }
}
