import { Controller, Get, Post, Body, UseGuards, Req, Patch, Param ,Delete} from '@nestjs/common';
import { CustomerVehiclesService } from '../services/customer-vehicles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class CustomerVehiclesController {
  constructor(private readonly vehiclesService: CustomerVehiclesService) {}

  @Get()
  getCustomerVehicles(@Req() req: any) {
    const userId = req.user.userId || req.user.id;
    return this.vehiclesService.findVehiclesByUser(userId);
  }

  @Post()
  addVehicle(@Req() req: any, @Body() dto: any) {
    const userId = req.user.userId || req.user.id;
    return this.vehiclesService.createVehicle(userId, dto);
  }
  @Patch(':id')
  updateVehicle(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    const userId = req.user.userId || req.user.id;
    return this.vehiclesService.updateVehicle(userId, id, dto);
  }

  // ✅ Added Delete Vehicle Route
  @Delete(':id')
  deleteVehicle(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId || req.user.id;
    return this.vehiclesService.deleteVehicle(userId, id);
  }
}
