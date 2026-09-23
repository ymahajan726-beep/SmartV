import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ServiceHistoryService } from '../service/service-history.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('service-history')
@UseGuards(JwtAuthGuard)
export class ServiceHistoryController {
  constructor(private readonly serviceHistoryService: ServiceHistoryService) {}

  @Get('vehicle/:vehicleId')
  getVehicleHistory(@Param('vehicleId') vehicleId: string) {
    return this.serviceHistoryService.getVehicleHistory(vehicleId);
  }

  @Get('customer/:customerId')
  getCustomerHistory(@Param('customerId') customerId: string) {
    return this.serviceHistoryService.getCustomerHistory(customerId);
  }
}