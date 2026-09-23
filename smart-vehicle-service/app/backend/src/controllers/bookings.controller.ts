import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { BookingsService } from '../service/bookings.service.js';
import { CreateBookingDto } from '../dto/create-booking.dto.js';
import { UpdateBookingDto } from '../dto/update-booking.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(
    @Req() req: { user: { id: string } },
    @Body(new ValidationPipe()) createBookingDto: CreateBookingDto,
  ) {
    return this.bookingsService.create(req.user.id, createBookingDto);
  }

  @Get()
  async findAll(@Req() req: { user: { id: string } }) {
    return this.bookingsService.findAllForCustomer(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Req() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.bookingsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Patch(':id/cancel')
  async cancel(
    @Req() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.bookingsService.cancel(id, req.user.id);
  }
}