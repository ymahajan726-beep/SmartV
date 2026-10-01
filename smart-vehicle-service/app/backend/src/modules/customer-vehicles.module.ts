import { Module } from '@nestjs/common';
import { CustomerVehiclesController } from '../controller/customer-vehicles.controller';
import { CustomerVehiclesService } from '../services/customer-vehicles.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CustomerVehiclesController],
  providers: [CustomerVehiclesService, PrismaService],
})
export class CustomerVehiclesModule {}

