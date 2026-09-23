import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminDashboardService } from '../service/admin-dashboard.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard)
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get('stats')
  getStats() {
    return this.adminDashboardService.getDashboardStats();
  }
}