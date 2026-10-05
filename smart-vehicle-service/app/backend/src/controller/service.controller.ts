import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ServiceService } from '../services/service.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}
@Get()
  findAll(@Query('serviceCenterId') serviceCenterId?: string) {
    return this.serviceService.findAll(serviceCenterId);
  }
 @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: { name: string; description?: string; price: number; duration?: string; serviceCenterId: string }) {
    return this.serviceService.create(dto);
  }
 @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: { name: string; description?: string; price: number; duration?: string; serviceCenterId: string }) {
    return this.serviceService.update(id, dto);
  }
 @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }
}