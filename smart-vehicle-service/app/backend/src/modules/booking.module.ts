import { Module } from '@nestjs/common';
import { BookingController } from '../controller/booking.controller';
import { BookingService } from '../services/booking.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BookingController],
  providers: [BookingService, PrismaService],
  exports: [BookingService],
})
export class BookingModule {}