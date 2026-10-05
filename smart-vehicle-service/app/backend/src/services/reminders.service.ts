import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RemindersService {
  constructor(private prisma: PrismaService) {}

  async getRemindersByUser(customerId: string) {
    return this.prisma.reminder.findMany({
      where: { customerId },
      include: { vehicle: true },
      orderBy: { dueDate: 'asc' },
    });
  }

  async createReminder(customerId: string, dto: { title: string; type: string; dueDate: string; vehicleId?: string }) {
    return this.prisma.reminder.create({
      data: {
        customerId,
        title: dto.title,
        type: dto.type || 'GENERAL',
        dueDate: new Date(dto.dueDate),
        vehicleId: dto.vehicleId || null,
      },
    });
  }
 async markAsCompleted(id: string, customerId: string) {
    const reminder = await this.prisma.reminder.findUnique({ where: { id } });
    if (!reminder || reminder.customerId !== customerId) {
      throw new NotFoundException('Reminder not found or unauthorized');
    }
return this.prisma.reminder.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
  }

  async deleteReminder(id: string, customerId: string) {
    const reminder = await this.prisma.reminder.findUnique({ where: { id } });
    if (!reminder || reminder.customerId !== customerId) {
      throw new NotFoundException('Reminder not found or unauthorized');
    }

    return this.prisma.reminder.delete({ where: { id } });
  }

  async getAllRemindersForAdmin() {
    return this.prisma.reminder.findMany({
      include: {
        customer: { select: { name: true, phone: true, email: true } },
        vehicle: true,
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async getAllCustomers() {
    return this.prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: { id: true, name: true, phone: true, email: true },
    });
  }
}