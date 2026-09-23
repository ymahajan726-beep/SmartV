import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceHistoryController } from '../controllers/service-history.controller.js';
import { ServiceHistoryService } from '../service/service-history.service.js';
import { Booking } from '../entities/booking.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  controllers: [ServiceHistoryController],
  providers: [ServiceHistoryService],
  exports: [ServiceHistoryService],
})
export class ServiceHistoryModule {}