import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AdminBookingsController } from '../controllers/bookings.controller.js'; // Sahi class name import kiya gaya hai
import { BookingsService } from '../service/bookings.service.js';
import { Booking, Vehicle, Service, ServiceCenter } from '../entities/index.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Vehicle, Service, ServiceCenter]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AdminBookingsController], // Array mein bhi AdminBookingsController rakha hai
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}