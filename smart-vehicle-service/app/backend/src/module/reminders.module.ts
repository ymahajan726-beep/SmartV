import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceRemindersController } from '../controllers/reminders.controller.js';
import { RemindersService } from '../service/reminders.service.js';
import { MaintenanceReminder } from '../entities/reminder.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceReminder])],
  controllers: [MaintenanceRemindersController],
  providers: [RemindersService],
  exports: [RemindersService],
})
export class RemindersModule {}