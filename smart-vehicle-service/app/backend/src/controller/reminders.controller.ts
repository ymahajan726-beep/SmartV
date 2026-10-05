import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { RemindersService } from '../services/reminders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reminders')
@UseGuards(JwtAuthGuard)
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Get('customer')
  getCustomerReminders(@Req() req: any) {
    const userId = req.user.userId || req.user.id;
    return this.remindersService.getRemindersByUser(userId);
  }

  @Post()
  createReminder(@Req() req: any, @Body() dto: { title: string; type: string; dueDate: string; vehicleId?: string }) {
    const userId = req.user.userId || req.user.id;
    return this.remindersService.createReminder(userId, dto);
  }

  @Patch(':id/complete')
  markComplete(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId || req.user.id;
    return this.remindersService.markAsCompleted(id, userId);
  }

  @Delete(':id')
  deleteReminder(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId || req.user.id;
    return this.remindersService.deleteReminder(id, userId);
  }

  @Get('admin')
  getAllAdminReminders() {
    return this.remindersService.getAllRemindersForAdmin();
  }
  
  @Post('admin')
  createAdminReminder(@Body() dto: { customerId: string; vehicleId?: string; title: string; type: string; dueDate: string }) {
    return this.remindersService.createReminder(dto.customerId, {
      title: dto.title,
      type: dto.type,
      dueDate: dto.dueDate,
      vehicleId: dto.vehicleId,
    });
  }

  @Get('admin/customers-list')
  getCustomersList() {
    return this.remindersService.getAllCustomers();
  }
}