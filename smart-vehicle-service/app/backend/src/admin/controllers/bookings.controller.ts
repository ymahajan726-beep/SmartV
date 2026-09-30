import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
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
    console.log('Admin User Request:', req.user);

    if (!req.user || !req.user.role || req.user.role.toLowerCase() !== 'admin') {
      throw new UnauthorizedException('Access denied: Admin privileges required.');
    }

    return await this.bookingsService.findAllForAdmin();
  }

  @Patch(':id/cancel')
  async cancelBooking(
    @Param('id') id: string,
    @Req() req: { user: { id: string; email: string; role: string; name: string } },
  ) {
    if (!req.user || !req.user.role || req.user.role.toLowerCase() !== 'admin') {
      throw new UnauthorizedException('Access denied: Admin privileges required.');
    }

    // Admin ke liye direct booking cancel karne ka call
    return await this.bookingsService.cancelByAdmin(id);
  }

  @Delete(':id')
  async deleteBooking(
    @Param('id') id: string,
    @Req() req: { user: { id: string; email: string; role: string; name: string } },
  ) {
    if (!req.user || !req.user.role || req.user.role.toLowerCase() !== 'admin') {
      throw new UnauthorizedException('Access denied: Admin privileges required.');
    }

    // Admin ke liye direct booking delete karne ka call
    return await this.bookingsService.remove(id);
  }
}