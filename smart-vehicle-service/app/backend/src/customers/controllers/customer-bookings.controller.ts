import { Controller, Get, Post, Body, Headers, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { CustomerBookingsService } from '../services/customer-bookings.service.js';

@Controller('customer/bookings')
export class CustomerBookingsController {
  constructor(private readonly customerBookingsService: CustomerBookingsService) {}

  @Get()
  async findAll(@Headers('user-id') userId: string) {
    if (!userId) {
      throw new UnauthorizedException('Access denied: Missing user authentication header');
    }
    return await this.customerBookingsService.findAllForCustomer(userId);
  }

  @Post()
  async create(@Headers('user-id') userId: string, @Body() dto: any) {
    if (!userId) {
      throw new UnauthorizedException('Access denied: Missing user authentication header');
    }
    return await this.customerBookingsService.createBooking(userId, dto);
  }
}