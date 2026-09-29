import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../../admin/entities/index.js';
import { CustomerBookingsController } from '../controllers/customer-bookings.controller.js';
import { CustomerBookingsService } from '../services/customer-bookings.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  controllers: [CustomerBookingsController],
  providers: [CustomerBookingsService],
  exports: [CustomerBookingsService], // Export karna zaroori hai taaki admin isko access kar sake
})
export class CustomerBookingsModule {}