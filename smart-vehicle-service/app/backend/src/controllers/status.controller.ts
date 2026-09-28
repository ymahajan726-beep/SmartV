import { Controller, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { StatusService } from '../service/status.service.js';
import { UpdateBookingStatusDto } from '../dto/update-booking-status.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('service-status')
@UseGuards(JwtAuthGuard)
export class ServiceStatusController {
  constructor(private readonly statusService: StatusService) {}

  @Patch(':id')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.statusService.updateStatus(id, dto);
  }
}