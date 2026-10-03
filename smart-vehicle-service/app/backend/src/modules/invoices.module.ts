import { Module } from '@nestjs/common';
import { InvoicesController } from '../controller/invoices.controller';
import { InvoicesService } from '../services/invoices.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [PrismaModule,AuthModule],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}