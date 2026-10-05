import { Module } from '@nestjs/common';
import { ServiceController } from '../controller/service.controller';
import { ServiceService } from '../services/service.service';
import { PrismaService } from '../prisma/prisma.service'; 
import {AuthModule} from './auth.module.js';
@Module({
    imports: [AuthModule], 
  controllers: [ServiceController, ],
  providers: [ServiceService, PrismaService],
  exports: [ServiceService],
})
export class ServiceModule {}