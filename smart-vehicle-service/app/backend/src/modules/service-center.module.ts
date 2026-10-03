import { Module } from '@nestjs/common';
import { ServiceCenterController } from '../controller/service-center.controller';
import { ServiceCenterService } from '../services/service-center.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './auth.module.js'; // <-- AuthModule ko yahan import karein

@Module({
    imports: [AuthModule], // <-- Imports array mein AuthModule daalna zaroori hai
  controllers: [ServiceCenterController],
  providers: [ServiceCenterService, PrismaService],
})
export class ServiceCenterModule {}