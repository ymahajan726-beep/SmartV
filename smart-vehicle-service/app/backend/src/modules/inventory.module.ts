import { Module } from '@nestjs/common';
import { InventoryController } from '../controller/inventory.controller';
import { InventoryService } from '../services/inventory.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './auth.module';

@Module({
    imports: [AuthModule], 
  controllers: [InventoryController],
  providers: [InventoryService, PrismaService],
  exports: [InventoryService],
})
export class InventoryModule {}