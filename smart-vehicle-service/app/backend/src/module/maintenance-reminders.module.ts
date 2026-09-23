import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceRemindersController } from '../controllers/maintenance-reminders.controller.js';
import { MaintenanceRemindersService } from '../service/maintenance-reminders.service.js';
import { MaintenanceReminder } from '../entities/maintenance-reminder.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceReminder])],
  controllers: [MaintenanceRemindersController],
  providers: [MaintenanceRemindersService],
  exports: [MaintenanceRemindersService],
})
export class MaintenanceRemindersModule {}