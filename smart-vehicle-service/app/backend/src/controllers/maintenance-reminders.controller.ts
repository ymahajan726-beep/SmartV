import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { MaintenanceRemindersService } from '../service/maintenance-reminders.service.js';
import { CreateMaintenanceReminderDto } from '../dto/create-maintenance-reminder.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('maintenance-reminders')
@UseGuards(JwtAuthGuard)
export class MaintenanceRemindersController {
  constructor(private readonly remindersService: MaintenanceRemindersService) {}

  @Post()
  create(@Body() createReminderDto: CreateMaintenanceReminderDto) {
    return this.remindersService.create(createReminderDto);
  }

  @Get()
  findAll() {
    return this.remindersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.remindersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.remindersService.remove(id);
  }
}