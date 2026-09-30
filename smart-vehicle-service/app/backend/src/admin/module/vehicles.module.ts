import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Vehicle } from '../entities/index.js';

import { AdminVehiclesController } from '../controllers/vehicles.controller.js';

import { VehiclesService } from '../service/vehicles.service.js';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    TypeOrmModule.forFeature([Vehicle]),
  ],

  controllers: [
    AdminVehiclesController,
  ],

  providers: [
    VehiclesService,
  ],

  exports: [
    VehiclesService,
  ],
})
export class VehiclesModule {}