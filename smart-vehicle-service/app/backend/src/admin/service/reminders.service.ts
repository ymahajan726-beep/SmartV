import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceReminder } from '../entities/reminder.entity.js';
import { CreateMaintenanceReminderDto } from '../dto/create-maintenance-reminder.dto.js';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(MaintenanceReminder)
    private remindersRepository: Repository<MaintenanceReminder>,
  ) {}

  async create(createDto: CreateMaintenanceReminderDto): Promise<MaintenanceReminder> {
    const reminder = this.remindersRepository.create(createDto);
    return await this.remindersRepository.save(reminder);
  }

  async findAll(): Promise<MaintenanceReminder[]> {
    return await this.remindersRepository.find();
  }

  async findOne(id: string): Promise<MaintenanceReminder> {
    const reminder = await this.remindersRepository.findOne({ where: { id } });
    if (!reminder) {
      throw new NotFoundException(`Maintenance Reminder with ID ${id} not found`);
    }
    return reminder;
  }

  async remove(id: string): Promise<void> {
    const reminder = await this.findOne(id);
    await this.remindersRepository.remove(reminder);
  }
}