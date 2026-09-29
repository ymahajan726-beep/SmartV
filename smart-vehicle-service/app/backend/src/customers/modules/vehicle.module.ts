import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleController } from '../controllers/vehicle.controller.js';
import { Vehicle } from '../../admin/entities/index.js'; // Global entity use karein
import { VehiclesModule } from '../../admin/module/vehicles.module.js'; // Shared VehiclesModule import karein

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle]),
    VehiclesModule, // <-- Isse VehicleController ko shared VehiclesService mil jayegi
  ],
  controllers: [VehicleController],
})
export class VehicleModule {}