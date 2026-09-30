import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from '../entities/index.js';
import { RegisterDto } from '../dto/register.dto.js';
import { LoginDto } from '../dto/login.dto.js';
import { UsersService } from './users.service.js';

interface OtpSession {
  otp: string;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private readonly otpSessions = new Map<
    string,
    OtpSession
  >();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{
    accessToken: string;
    user: Partial<User>;
  }> {
    const exists =
      await this.usersService.findByEmail(
        registerDto.email,
      );

    if (exists) {
      throw new UnauthorizedException(
        'Email already registered.',
      );
    }

    const passwordHash =
      await bcrypt.hash(
        registerDto.password,
        10,
      );

    const user =
      await this.usersService.create({
        name: registerDto.name,
        email: registerDto.email,
        phone: registerDto.phone,
        passwordHash,
        role:
          registerDto.role ??
          UserRole.CUSTOMER,
        isActive: true,
      });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken:
        this.jwtService.sign(payload),

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{
    accessToken: string;
    user: Partial<User>;
  }> {
    let user: User | null = null;

    const identifier = loginDto.email;

    if (identifier) {
      if (identifier.includes('@')) {
        user =
          await this.usersService.findByEmail(
            identifier,
          );
      } else {
        const userRepo =
          this.usersService[
            'userRepository'
          ] || null;

        if (userRepo) {
          user =
            await userRepo.findOne({
              where: {
                phone: identifier,
              },
            });
        }
      }
    }

    if (
      !user ||
      !(await bcrypt.compare(
        loginDto.password,
        user.passwordHash,
      ))
    ) {
      throw new UnauthorizedException(
        'Invalid credentials (email/phone or password).',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'User account is inactive.',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken:
        this.jwtService.sign(payload),

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  /**
   * TEMPORARY DEVELOPMENT OTP
   */
  async requestCustomerOtp(
    phone: string,
  ): Promise<{
    success: boolean;
    message: string;
    devOtp?: string;
  }> {
    const cleanPhone =
      phone.trim();

    if (
      !/^\d{10}$/.test(
        cleanPhone,
      )
    ) {
      throw new UnauthorizedException(
        'Please enter a valid 10-digit mobile number.',
      );
    }

    const userRepo =
      this.usersService[
        'userRepository'
      ] || null;

    if (!userRepo) {
      throw new UnauthorizedException(
        'User repository is not available.',
      );
    }

    let user: User | null =
      await userRepo.findOne({
        where: {
          phone: cleanPhone,
        },
      });

    /*
     * FIXED: Agar yeh phone number pehle se exist karta hai, 
     * toh naya user create nahi hoga, wahi purana user use hoga.
     */
    if (!user) {
      const temporaryEmail =
        `dev.customer.${cleanPhone}@autocare.local`;

      const temporaryPassword =
        await bcrypt.hash(
          `DEV-${cleanPhone}-PASSWORD`,
          10,
        );

      user =
        await this.usersService.create({
          name: 'Development Customer',
          email: temporaryEmail,
          phone: cleanPhone,
          passwordHash:
            temporaryPassword,
          role: UserRole.CUSTOMER,
          isActive: true,
        });
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Customer account is inactive.',
      );
    }

    const otp = '1234';

    this.otpSessions.set(
      cleanPhone,
      {
        otp,
        expiresAt:
          Date.now() +
          5 * 60 * 1000,
      },
    );

    return {
      success: true,
      message:
        'OTP generated successfully.',
      devOtp: otp,
    };
  }

  async verifyCustomerOtp(
    phone: string,
    otp: string,
  ): Promise<{
    accessToken: string;
    user: Partial<User>;
  }> {
    const cleanPhone =
      phone.trim();

    const cleanOtp =
      otp.trim();

    const otpSession =
      this.otpSessions.get(
        cleanPhone,
      );

    if (!otpSession) {
      throw new UnauthorizedException(
        'OTP not requested. Please request OTP again.',
      );
    }

    if (
      Date.now() >
      otpSession.expiresAt
    ) {
      this.otpSessions.delete(
        cleanPhone,
      );

      throw new UnauthorizedException(
        'OTP has expired. Please request a new OTP.',
      );
    }

    if (
      otpSession.otp !==
      cleanOtp
    ) {
      throw new UnauthorizedException(
        'Invalid OTP.',
      );
    }

    const userRepo =
      this.usersService[
        'userRepository'
      ] || null;

    if (!userRepo) {
      throw new UnauthorizedException(
        'User repository is not available.',
      );
    }

    const user: User | null =
      await userRepo.findOne({
        where: {
          phone: cleanPhone,
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        'Customer account not found.',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Customer account is inactive.',
      );
    }

    this.otpSessions.delete(
      cleanPhone,
    );

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken:
        this.jwtService.sign(payload),

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user =
      await this.usersService.findByEmail(
        email,
      );

    if (!user) {
      return null;
    }

    const valid =
      await bcrypt.compare(
        password,
        user.passwordHash,
      );

    return valid ? user : null;
  }
}