import {
  Controller,
  Get,
  Delete,
  Param,
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
    if (!req.user || !req.user.role || req.user.role.toLowerCase() !== 'admin') {
      throw new UnauthorizedException('Access denied: Admin privileges required.');
    }

    return await this.vehiclesService.findAll();
  }

  // ✅ Naya Delete Route Admin ke liye
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: { user: { id: string; email: string; role: string; name: string } },
  ) {
    if (!req.user || !req.user.role || req.user.role.toLowerCase() !== 'admin') {
      throw new UnauthorizedException('Access denied: Admin privileges required.');
    }

    return await this.vehiclesService.remove(id);
  }
}