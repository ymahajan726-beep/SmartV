import { Controller, Get, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { CustomerBookingsService } from '../services/customer-bookings.service.js';
import { CreateBookingDto } from '../dto/booking.dto.js';

@Controller('customer/bookings')
export class CustomerBookingsController {
  constructor(private readonly customerBookingsService: CustomerBookingsService) {}

  @Get()
  async findAll(@Headers('user-id') userId: string) {
    if (!userId) {
      throw new UnauthorizedException('Missing user-id header.');
    }
    return this.customerBookingsService.findAllForCustomer(userId);
  }

  @Post()
  async create(
    @Headers('user-id') userId: string,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    if (!userId) {
      throw new UnauthorizedException('Missing user-id header.');
    }
    return this.customerBookingsService.create(userId, createBookingDto);
  }
}