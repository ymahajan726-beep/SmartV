import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../entities/index.js';
import { CreateServiceCenterDto } from '../dto/create-service-center.dto.js';
import { UpdateServiceCenterDto } from '../dto/update-service-center.dto.js';
import { ServiceCentersService } from '../service/service-centers.service.js';

@Controller('service-centers')
export class ServiceCentersController {
  constructor(private readonly service: ServiceCentersService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) create(@Body(new ValidationPipe({ whitelist: true })) dto: CreateServiceCenterDto) { return this.service.create(dto); }
  @Patch(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) update(@Param('id') id: string, @Body(new ValidationPipe({ whitelist: true })) dto: UpdateServiceCenterDto) { return this.service.update(id, dto); }
  @Delete(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) remove(@Param('id') id: string) { return this.service.remove(id); }
}
