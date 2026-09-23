import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesController } from '../controllers/invoices.controller.js';
import { InvoicesService } from '../service/invoices.service.js';
import { Invoice } from '../entities/invoice.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}