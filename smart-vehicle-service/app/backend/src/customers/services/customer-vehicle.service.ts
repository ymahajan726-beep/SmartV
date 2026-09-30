
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Vehicle } from '../../admin/entities/vehicle.entity.js';

import { CreateCustomerVehicleDto } from '../dto/create-customer-vehicle.dto.js';
import { UpdateCustomerVehicleDto } from '../dto/update-customer-vehicle.dto.js';

@Injectable()
export class CustomerVehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  /**
   * CUSTOMER
   * Get only vehicles belonging to logged-in customer.
   */
  async findMyVehicles(
    customerId: string,
  ): Promise<Vehicle[]> {
    if (!customerId) {
      throw new NotFoundException(
        'Customer session not found. Please login again.',
      );
    }

    return await this.vehicleRepository.find({
      where: {
        customerId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * CUSTOMER
   * Create vehicle for logged-in customer.
   *
   * customerId comes ONLY from JWT.
   */
  async createVehicle(
    customerId: string,
    dto: CreateCustomerVehicleDto,
  ): Promise<Vehicle> {
    if (!customerId) {
      throw new NotFoundException(
        'Customer session not found. Please login again.',
      );
    }

    const registrationNumber =
      dto.registrationNumber.trim().toUpperCase();

    /**
     * Registration number globally unique hai.
     * Isliye ek customer ki vehicle ka registration
     * doosra customer reuse nahi kar sakta.
     */
    const existingVehicle =
      await this.vehicleRepository.findOne({
        where: {
          registrationNumber,
        },
      });

    if (existingVehicle) {
      throw new ConflictException(
        'A vehicle with this registration number already exists.',
      );
    }

    const vehicle =
      this.vehicleRepository.create({
        customerId,

        registrationNumber,

        make: dto.make.trim(),

        model: dto.model.trim(),

        variant:
          dto.variant?.trim() || undefined,

        year: dto.year,

        fuelType:
          dto.fuelType.trim().toUpperCase(),

        currentMileage:
          dto.currentMileage,

        color:
          dto.color.trim(),

        imageUrl:
          dto.imageUrl?.trim() || undefined,
      });

    return await this.vehicleRepository.save(
      vehicle,
    );
  }

  /**
   * CUSTOMER
   * Update only vehicle owned by logged-in customer.
   */
  async updateVehicle(
    customerId: string,
    vehicleId: string,
    dto: UpdateCustomerVehicleDto,
  ): Promise<Vehicle> {
    const vehicle =
      await this.vehicleRepository.findOne({
        where: {
          id: vehicleId,
          customerId,
        },
      });

    /**
     * IMPORTANT:
     * vehicleId + customerId dono match hone chahiye.
     *
     * Isse customer dusre customer ki vehicle
     * ID manually bhejkar update nahi kar sakta.
     */
    if (!vehicle) {
      throw new NotFoundException(
        'Vehicle not found or you are not authorized to update it.',
      );
    }

    /**
     * Registration number change ho raha hai
     * to global duplicate check.
     */
    if (
      dto.registrationNumber !== undefined
    ) {
      const registrationNumber =
        dto.registrationNumber
          .trim()
          .toUpperCase();

      if (
        registrationNumber !==
        vehicle.registrationNumber
      ) {
        const existingVehicle =
          await this.vehicleRepository.findOne({
            where: {
              registrationNumber,
            },
          });

        if (
          existingVehicle &&
          existingVehicle.id !== vehicle.id
        ) {
          throw new ConflictException(
            'A vehicle with this registration number already exists.',
          );
        }

        vehicle.registrationNumber =
          registrationNumber;
      }
    }

    if (dto.make !== undefined) {
      vehicle.make =
        dto.make.trim();
    }

    if (dto.model !== undefined) {
      vehicle.model =
        dto.model.trim();
    }

    if (dto.variant !== undefined) {
      vehicle.variant =
        dto.variant?.trim() || undefined;
    }

    if (dto.year !== undefined) {
      vehicle.year =
        dto.year;
    }

    if (dto.fuelType !== undefined) {
      vehicle.fuelType =
        dto.fuelType
          .trim()
          .toUpperCase();
    }

    if (
      dto.currentMileage !== undefined
    ) {
      vehicle.currentMileage =
        dto.currentMileage;
    }

    if (dto.color !== undefined) {
      vehicle.color =
        dto.color.trim();
    }

    if (dto.imageUrl !== undefined) {
      vehicle.imageUrl =
        dto.imageUrl?.trim() || undefined;
    }

    return await this.vehicleRepository.save(
      vehicle,
    );
  }

  /**
   * CUSTOMER
   * Delete only vehicle owned by logged-in customer.
   */
  async deleteVehicle(
    customerId: string,
    vehicleId: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const vehicle =
      await this.vehicleRepository.findOne({
        where: {
          id: vehicleId,
          customerId,
        },
      });

    if (!vehicle) {
      throw new NotFoundException(
        'Vehicle not found or you are not authorized to delete it.',
      );
    }

    await this.vehicleRepository.remove(
      vehicle,
    );

    return {
      success: true,
      message:
        'Vehicle deleted successfully.',
    };
  }
}

