import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class CustomerAuthService {
  // Temporary memory storage for OTPs (In production, use Redis)
  private otpStorage = new Map<string, string>();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. Request OTP
  async requestOtp(phone: string) {
    // Development default OTP
    const devOtp = '1234';
    this.otpStorage.set(phone, devOtp);

    return {
      message: 'OTP generated successfully',
      devOtp, // Frontend notification ke liye
    };
  }

  // 2. Verify OTP & Register/Login Customer
  async verifyOtp(phone: string, otp: string) {
    const storedOtp = this.otpStorage.get(phone);

    if (!storedOtp || storedOtp !== otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Clear OTP after successful verification
    this.otpStorage.delete(phone);

    // Check if customer already exists, else create new
    let user = await this.prisma.user.findFirst({
      where: { phone },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: `Customer_${phone.slice(-4)}`, // Default name based on last 4 digits
          email: `${phone}@smartvehicle.com`,   // Unique placeholder email
          passwordHash: 'OTP_AUTHENTICATED_USER',
          phone,
          role: Role.CUSTOMER,
          isActive: true,
        },
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated');
    }

    // Generate strict isolated JWT payload
    const payload = { userId: user.id, phone: user.phone, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Authentication successful',
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    };
  }
}