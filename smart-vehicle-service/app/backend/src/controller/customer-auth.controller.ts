import { Controller, Post, Body } from '@nestjs/common';
import { CustomerAuthService } from '../services/customer-auth.service.js';
import { RequestOtpDto, VerifyOtpDto } from '../dto/customer-otp.dto.js';

@Controller('auth/customer')
export class CustomerAuthController {
  constructor(private readonly customerAuthService: CustomerAuthService) {}

  @Post('request-otp')
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.customerAuthService.requestOtp(dto.phone);
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.customerAuthService.verifyOtp(dto.phone, dto.otp);
  }
}