import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ServiceCenterService } from '../services/service-center.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('service-centers')
export class ServiceCenterController {
  constructor(private readonly serviceCenterService: ServiceCenterService) {}

  @Get()
  findAll() {
    return this.serviceCenterService.findAll();
  }
 @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: { name: string; location: string; phone?: string }) {
    return this.serviceCenterService.create(dto);
  }
 @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: { name: string; location: string; phone?: string }) {
    return this.serviceCenterService.update(id, dto);
  }
 @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.serviceCenterService.remove(id);
  }
}