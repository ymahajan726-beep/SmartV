import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminVehiclesService } from '../services/admin-vehicles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminVehiclesController {
  constructor(private readonly adminVehiclesService: AdminVehiclesService) {}

  @Get()
  getAllVehicles() {
    return this.adminVehiclesService.findAllVehiclesWithOwners();
  }
}