import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { SparePartsService } from '../service/spare-parts.service.js';
import { CreateSparePartDto } from '../dto/create-spare-part.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('spare-parts')
@UseGuards(JwtAuthGuard)
export class SparePartsController {
  constructor(private readonly sparePartsService: SparePartsService) {}

  @Post()
  create(@Body() createSparePartDto: CreateSparePartDto) {
    return this.sparePartsService.create(createSparePartDto);
  }

  @Get()
  findAll() {
    return this.sparePartsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sparePartsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sparePartsService.remove(id);
  }
}