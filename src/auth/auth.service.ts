import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { validatePassword } from './utils/password.validator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Validate password
    const passwordValidation = validatePassword(dto.password);
    if (!passwordValidation.isValid) {
      throw new BadRequestException({
        message: 'Invalid password',
        errors: passwordValidation.errors,
      });
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      senderName: dto.senderName,
      senderEmail: dto.senderEmail,
      senderPhone: dto.senderPhone,
      senderAddress: dto.senderAddress,
      senderCity: dto.senderCity,
      senderCountry: dto.senderCountry,
      senderTaxId: dto.senderTaxId,
      bankName: dto.bankName,
      accountNumber: dto.accountNumber,
      accountHolderName: dto.accountHolderName,
      routingCode: dto.routingCode,
      swiftCode: dto.swiftCode,
      branchName: dto.branchName,
      invoicePrefix: dto.invoicePrefix || 'INV',
      defaultCurrency: dto.defaultCurrency || 'USD',
      defaultPaymentTermsDays: dto.defaultPaymentTermsDays || 7,
    });

    await this.userRepository.save(user);

    return this.generateTokens(user);
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateCredentials(dto.email, dto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    return this.generateTokens(user);
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub, isActive: true },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verify stored refresh token matches
      const isRefreshTokenValid = await bcrypt.compare(
        token,
        user.refreshToken,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Refresh token mismatch');
      }

      // Check if refresh token is expired
      if (
        user.refreshTokenExpiresAt &&
        user.refreshTokenExpiresAt < new Date()
      ) {
        throw new UnauthorizedException('Refresh token expired');
      }

      // Generate new tokens
      return this.generateTokens(user);
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.userRepository.update(
      { id: userId },
      {
        refreshToken: null,
        refreshTokenExpiresAt: null,
      },
    );

    return { message: 'Logged out successfully' };
  }

  async validateUser(userId: string) {
    const cacheKey = `user_${userId}`;
    let user = await this.cacheManager.get<User>(cacheKey);

    if (!user) {
      user =
        (await this.userRepository.findOne({
          where: { id: userId, isActive: true },
        })) || undefined;
      if (user) {
        await this.cacheManager.set(cacheKey, user);
      }
    }
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Prevent email updates
    if (dto.email) {
      throw new BadRequestException('Email cannot be updated');
    }

    // Validate password if being updated
    if (dto.password) {
      const passwordValidation = validatePassword(dto.password);
      if (!passwordValidation.isValid) {
        throw new BadRequestException({
          message: 'Invalid password',
          errors: passwordValidation.errors,
        });
      }
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    // Update all allowed fields
    Object.assign(user, dto);
    await this.userRepository.save(user);

    // Invalidate user cache
    await this.cacheManager.del(`user_${userId}`);

    return this.sanitizeUser(user);
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    // Generate short-lived access token (15 minutes)
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    // Generate long-lived refresh token (7 days)
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      expiresIn: '7d',
    });

    // Hash and store refresh token
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7); // 7 days

    await this.userRepository.update(
      { id: user.id },
      {
        refreshToken: hashedRefreshToken,
        refreshTokenExpiresAt,
      },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: '15m',
      token_type: 'Bearer',
      user: this.sanitizeUser(user),
    };
  }

  private sanitizeUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, refreshToken: _refreshToken, ...rest } =
      user;
    return rest;
  }
}
