import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { ServiceCenter } from '../entities/index.js';
import { ServiceCentersController } from './service-centers.controller.js';
import { ServiceCentersService } from './service-centers.service.js';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), TypeOrmModule.forFeature([ServiceCenter])],
  controllers: [ServiceCentersController],
  providers: [ServiceCentersService, RolesGuard],
  exports: [ServiceCentersService],
})
export class ServiceCentersModule {}
