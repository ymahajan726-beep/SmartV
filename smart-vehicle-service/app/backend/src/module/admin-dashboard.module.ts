import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminDashboardController } from '../controllers/admin-dashboard.controller.js';
import { AdminDashboardService } from '../service/admin-dashboard.service.js';
import { User, Booking, Invoice, Vehicle, ServiceCenter, SparePart } from '../entities/index.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Booking,
      Invoice,
      Vehicle,
      ServiceCenter,
      SparePart,
    ]),
  ],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService],
  exports: [AdminDashboardService],
})
export class AdminDashboardModule {}