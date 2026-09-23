import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport'; // <--- 1. Yeh import karein
import { BookingsController } from '../controllers/bookings.controller.js';
import { BookingsService } from '../service/bookings.service.js';
import { Booking, Vehicle, Service, ServiceCenter } from '../entities/index.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Vehicle, Service, ServiceCenter]),
    PassportModule.register({ defaultStrategy: 'jwt' }), // <--- 2. Yahan register karein
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}