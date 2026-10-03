import { Module } from '@nestjs/common';
import { ServiceController } from '../controller/service.controller';
import { ServiceService } from '../services/service.service';
import { PrismaService } from '../prisma/prisma.service'; // Aapke project ke hisab se import path check kar lein
import {AuthModule} from './auth.module.js'; // Sahi path ke sath update kiya gaya hai  
@Module({
    imports: [AuthModule], // <-- Imports array mein AuthModule daalna zaroori hai
  controllers: [ServiceController, ],
  providers: [ServiceService, PrismaService],
  exports: [ServiceService],
})
export class ServiceModule {}