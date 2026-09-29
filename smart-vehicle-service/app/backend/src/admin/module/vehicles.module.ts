import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from '../entities/index.js';
import { VehicleController } from '../../customers/controllers/vehicle.controller.js'; // Customer controller (singular)
import { AdminVehiclesController } from '../controllers/vehicles.controller.js';
import { VehiclesService } from '../service/vehicles.service.js';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehicleController, AdminVehiclesController], // Dono ke exact imported names yahan matched hain
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}