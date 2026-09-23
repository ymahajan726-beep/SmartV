import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceStatusController } from '../controllers/service-status.controller.js';
import { ServiceStatusService } from '../service/service-status.service.js';
import { Booking } from '../entities/booking.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  controllers: [ServiceStatusController],
  providers: [ServiceStatusService],
  exports: [ServiceStatusService],
})
export class ServiceStatusModule {}