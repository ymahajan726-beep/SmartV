import { Module } from '@nestjs/common';
import { AdminVehiclesController } from '../controller/admin-vehicles.controller.js';
import { AdminVehiclesService } from '../services/admin-vehicles.service';
import { PrismaService } from '../prisma/prisma.service'; 
import { AuthModule } from './auth.module.js';
@Module({
  controllers: [AdminVehiclesController],
  providers: [AdminVehiclesService, PrismaService],
  imports: [AuthModule],
})
export class AdminVehiclesModule {}