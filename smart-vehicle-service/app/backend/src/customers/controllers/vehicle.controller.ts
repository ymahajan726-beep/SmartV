import { Controller, Get, Post, Delete, Body, Param, Headers, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { VehiclesService } from '../../admin/service/vehicles.service.js'; // Sahi shared service import ki gayi hai
import { CreateVehicleDto } from '../dto/create-vehicle.dto.js';

@Controller('customer/vehicles')
export class VehicleController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  async findAll(@Headers('user-id') userId: string) {
    if (!userId) {
      throw new UnauthorizedException('Access denied: Missing user authentication header');
    }
    return await this.vehiclesService.findAllForUser(userId);
  }

  @Post()
  async create(@Headers('user-id') userId: string, @Body(new ValidationPipe()) dto: CreateVehicleDto) {
    if (!userId) {
      throw new UnauthorizedException('Access denied: Missing user authentication header');
    }
    // Note: createVehicle method ke liye user object ki zaroorat hoti hai, hum mock user object pass kar rahe hain userId ke sath
    const mockUser = { id: userId, email: 'customer@local', role: 'customer', name: 'Customer' };
    return await this.vehiclesService.createVehicle(mockUser as any, dto as any);
  }

  @Delete(':id')
  async remove(@Headers('user-id') userId: string, @Param('id') id: string) {
    if (!userId) {
      throw new UnauthorizedException('Access denied: Missing user authentication header');
    }
    await this.vehiclesService.deleteVehicle(Number (id), userId);
    return { success: true };
  }
}