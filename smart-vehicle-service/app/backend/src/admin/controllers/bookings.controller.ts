import {
  Controller,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { BookingsService } from '../service/bookings.service.js';

@Controller('admin/bookings')
@UseGuards(JwtAuthGuard)
export class AdminBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async findAllForAdmin(
    @Req() req: { user: { id: string; email: string; role: string; name: string } },
  ) {
    // Admin role verification
    if (!req.user || req.user.role !== 'admin') {
      throw new UnauthorizedException('Access denied: Admin privileges required.');
    }

    return this.bookingsService.findAllForAdmin();
  }
}