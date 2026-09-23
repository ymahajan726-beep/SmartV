import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../entities/index.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { ServicesController } from '../controllers/services.controller.js';
import { ServicesService } from '../service/services.service.js';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), TypeOrmModule.forFeature([Service])],
  controllers: [ServicesController],
  providers: [ServicesService, RolesGuard],
  exports: [ServicesService],
})
export class ServicesModule {}
