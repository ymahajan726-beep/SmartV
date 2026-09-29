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
    // Debug ke liye console log laga sakte hain taaki pata chale token mein kya role aa raha hai
    console.log('Admin User Request:', req.user);

    // Case-insensitive role check ('admin' ya 'ADMIN' dono chalenge)
    if (!req.user || !req.user.role || req.user.role.toLowerCase() !== 'admin') {
      throw new UnauthorizedException('Access denied: Admin privileges required.');
    }

    return await this.bookingsService.findAllForAdmin();
  }
}