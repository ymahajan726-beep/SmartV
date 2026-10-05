import { Module } from '@nestjs/common';
import { ServiceCenterController } from '../controller/service-center.controller';
import { ServiceCenterService } from '../services/service-center.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './auth.module.js'; 

@Module({
    imports: [AuthModule], 
  controllers: [ServiceCenterController],
  providers: [ServiceCenterService, PrismaService],
})
export class ServiceCenterModule {}