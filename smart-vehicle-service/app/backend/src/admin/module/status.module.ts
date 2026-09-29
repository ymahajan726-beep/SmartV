import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceStatusController } from '../controllers/status.controller.js';
import { StatusService } from '../service/status.service.js';
import { Booking } from '../entities/booking.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  controllers: [ServiceStatusController],
  providers: [StatusService],
  exports: [StatusService],
})
export class ServiceStatusModule {}