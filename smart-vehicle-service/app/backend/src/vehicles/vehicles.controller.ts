import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '../entities/index.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { VehiclesService } from './vehicles.service.js';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js';

@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  async create(
    @Req() req: { user: { id: string; email: string; role: string; name: string } },
    @Body(new ValidationPipe()) dto: CreateVehicleDto,
  ) {
    return this.vehiclesService.createVehicle(req.user as unknown as User, dto as Partial<User> as any);
  }

  @Get()
  async findAll(@Req() req: { user: { id: string } }) {
    return this.vehiclesService.findAllForUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Req() req: { user: { id: string } }, @Param('id') id: string) {
    return this.vehiclesService.findOneForUser(id, req.user.id);
  }

  @Patch(':id')
  async update(
    @Req() req: { user: { id: string } },
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.updateVehicle(id, req.user.id, dto as any);
  }

  @Delete(':id')
  async remove(@Req() req: { user: { id: string } }, @Param('id') id: string) {
    await this.vehiclesService.deleteVehicle(id, req.user.id);
    return { success: true };
  }
}
