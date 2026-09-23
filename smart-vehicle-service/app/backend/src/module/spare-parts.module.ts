import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SparePartsController } from '../controllers/spare-parts.controller.js';
import { SparePartsService } from '../service/spare-parts.service.js';
import { SparePart } from '../entities/spare-part.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([SparePart]),
  ],
  controllers: [SparePartsController],
  providers: [SparePartsService],
  exports: [SparePartsService],
})
export class SparePartsModule {}