
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

import { CustomerVehicleService } from '../services/customer-vehicle.service.js';

import { CreateCustomerVehicleDto } from '../dto/create-customer-vehicle.dto.js';
import { UpdateCustomerVehicleDto } from '../dto/update-customer-vehicle.dto.js';

@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class CustomerVehicleController {
  constructor(
    private readonly customerVehicleService: CustomerVehicleService,
  ) {}

  /**
   * CUSTOMER - GET ONLY OWN VEHICLES
   */
  @Get()
  async findMyVehicles(
    @Req()
    req: {
      user: {
        id: string;
        email: string;
        role: string;
        name: string;
      };
    },
  ) {
    this.verifyCustomer(req);

    return await this.customerVehicleService.findMyVehicles(
      req.user.id,
    );
  }

  /**
   * CUSTOMER - CREATE VEHICLE
   *
   * customerId frontend se nahi liya ja raha.
   * JWT user.id se automatically ownership set hogi.
   */
  @Post()
  async createVehicle(
    @Req()
    req: {
      user: {
        id: string;
        email: string;
        role: string;
        name: string;
      };
    },
    @Body() dto: CreateCustomerVehicleDto,
  ) {
    this.verifyCustomer(req);

    return await this.customerVehicleService.createVehicle(
      req.user.id,
      dto,
    );
  }

  /**
   * CUSTOMER - UPDATE ONLY OWN VEHICLE
   */
  @Patch(':id')
  async updateVehicle(
    @Req()
    req: {
      user: {
        id: string;
        email: string;
        role: string;
        name: string;
      };
    },
    @Param('id') vehicleId: string,
    @Body() dto: UpdateCustomerVehicleDto,
  ) {
    this.verifyCustomer(req);

    return await this.customerVehicleService.updateVehicle(
      req.user.id,
      vehicleId,
      dto,
    );
  }

  /**
   * CUSTOMER - DELETE ONLY OWN VEHICLE
   */
  @Delete(':id')
  async deleteVehicle(
    @Req()
    req: {
      user: {
        id: string;
        email: string;
        role: string;
        name: string;
      };
    },
    @Param('id') vehicleId: string,
  ) {
    this.verifyCustomer(req);

    return await this.customerVehicleService.deleteVehicle(
      req.user.id,
      vehicleId,
    );
  }

  /**
   * CUSTOMER ROLE CHECK
   */
  private verifyCustomer(
    req: {
      user?: {
        id: string;
        email: string;
        role: string;
        name: string;
      };
    },
  ): void {
    if (
      !req.user ||
      !req.user.id ||
      !req.user.role ||
      req.user.role.toLowerCase() !== 'customer'
    ) {
      throw new UnauthorizedException(
        'Access denied: Customer privileges required.',
      );
    }
  }
}

