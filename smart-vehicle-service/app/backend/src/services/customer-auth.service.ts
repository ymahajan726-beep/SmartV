import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class CustomerAuthService {
  private otpStorage = new Map<string, string>();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async requestOtp(phone: string) {
    const devOtp = '1234';
    this.otpStorage.set(phone, devOtp);

    return {
      message: 'OTP generated successfully',
      devOtp,
    };
  }

  async verifyOtp(phone: string, otp: string) {
    const storedOtp = this.otpStorage.get(phone);

    if (!storedOtp || storedOtp !== otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
    this.otpStorage.delete(phone);

    let user = await this.prisma.user.findFirst({
      where: { phone },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: `Customer_${phone.slice(-4)}`, 
          email: `${phone}@smartvehicle.com`,   
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