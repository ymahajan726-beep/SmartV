import { Controller, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ServiceStatusService } from '../service/service-status.service.js';
import { UpdateBookingStatusDto } from '../dto/update-booking-status.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('service-status')
@UseGuards(JwtAuthGuard)
export class ServiceStatusController {
  constructor(private readonly serviceStatusService: ServiceStatusService) {}

  @Patch(':id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
  ) {
    return this.serviceStatusService.updateStatus(id, updateBookingStatusDto);
  }
}