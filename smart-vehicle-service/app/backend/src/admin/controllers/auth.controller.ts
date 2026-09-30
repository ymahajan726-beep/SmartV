import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { Request } from 'express';

import { AuthService } from '../service/auth.service.js';

import { LoginDto } from '../dto/login.dto.js';
import { RegisterDto } from '../dto/register.dto.js';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // =====================================================
  // NORMAL EMAIL / PASSWORD LOGIN
  // =====================================================

  @Post('register')
  async register(
    @Body(new ValidationPipe())
    registerDto: RegisterDto,
  ) {
    return this.authService.register(
      registerDto,
    );
  }

  @Post('login')
  async login(
    @Body(new ValidationPipe())
    loginDto: LoginDto,
  ) {
    return this.authService.login(
      loginDto,
    );
  }

  // =====================================================
  // TEMPORARY CUSTOMER OTP LOGIN
  // DEVELOPMENT / TESTING ONLY
  // =====================================================

  @Post('customer/request-otp')
  async requestCustomerOtp(
    @Body() body: { phone: string },
  ) {
    return this.authService.requestCustomerOtp(
      body.phone,
    );
  }

  @Post('customer/verify-otp')
  async verifyCustomerOtp(
    @Body()
    body: {
      phone: string;
      otp: string;
    },
  ) {
    return this.authService.verifyCustomerOtp(
      body.phone,
      body.otp,
    );
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  @Post('logout')
  async logout() {
    return {
      success: true,
      message:
        'Logged out successfully.',
    };
  }

  // =====================================================
  // CURRENT LOGGED-IN USER
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(
    @Req()
    req: Request & {
      user: {
        id: string;
        email: string;
        role: string;
        name: string;
      };
    },
  ) {
    return req.user;
  }

  // =====================================================
  // CURRENT LOGGED-IN CUSTOMER PROFILE (STRICT ISOLATION)
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Get('customer/me')
  async customerMe(
    @Req()
    req: Request & {
      user: {
        id: string;
        email: string;
        role: string;
        name: string;
      };
    },
  ) {
    const user = req.user;
    
    // Agar admin token ke sath customer portal par access kiya jaye, toh role fallback/handling
    if (user.role?.toLowerCase() === 'admin') {
      return {
        id: user.id,
        name: "Valued Customer",
        email: user.email,
        role: "CUSTOMER",
        isGuest: true,
      };
    }

    return user;
  }
}