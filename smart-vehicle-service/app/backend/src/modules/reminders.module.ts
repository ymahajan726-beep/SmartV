import { Module } from '@nestjs/common';
import { RemindersController } from '../controller/reminders.controller';
import { RemindersService } from '../services/reminders.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [PrismaModule ,AuthModule],
  controllers: [RemindersController],
  providers: [RemindersService],
  exports: [RemindersService],
})
export class RemindersModule {}