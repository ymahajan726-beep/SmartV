
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Vehicle } from '../../admin/entities/vehicle.entity.js';

import { CustomerVehicleController } from '../controllers/customer-vehicle.controller.ts.js';
import { CustomerVehicleService } from '../services/customer-vehicle.service.js';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    TypeOrmModule.forFeature([
      Vehicle,
    ]),
  ],

  controllers: [
    CustomerVehicleController,
  ],

  providers: [
    CustomerVehicleService,
  ],

  exports: [
    CustomerVehicleService,
  ],
})
export class CustomerVehicleModule {}

