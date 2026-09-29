import {
  Controller,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { VehiclesService } from '../service/vehicles.service.js';

@Controller('admin/vehicles')
@UseGuards(JwtAuthGuard)
export class AdminVehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  async findAllForAdmin(
    @Req() req: { user: { id: string; email: string; role: string; name: string } },
  ) {
    // Industry-level check: Ensure user has admin privileges
    if (!req.user || req.user.role !== 'admin') {
      throw new UnauthorizedException('Access denied: Admin privileges required.');
    }

    return await this.vehiclesService.findAllForAdmin();
  }
}