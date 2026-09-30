import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Vehicle } from '../entities/vehicle.entity.js';
import { CreateVehicleDto } from '../dto/create-vehicle.dto.js';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto.js';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  // ================================
  // ADMIN - GET ALL VEHICLES
  // ================================
  async findAll(): Promise<Vehicle[]> {
    return await this.vehicleRepository.find({
      relations: {
        customer: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // ================================
  // CUSTOMER - GET OWN VEHICLES
  // ================================
  async findAllForUser(customerId: string): Promise<Vehicle[]> {
    if (!customerId) {
      return [];
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

  // ================================
  // CREATE VEHICLE
  // ================================
  async createVehicle(
    user: { id: string },
    createDto: CreateVehicleDto,
  ): Promise<Vehicle> {
    if (!user?.id) {
      throw new NotFoundException(
        'Customer session not found. Please login again.',
      );
    }

    const vehicle: Vehicle = this.vehicleRepository.create({
      customerId: user.id,

      registrationNumber:
        createDto.registrationNumber.trim().toUpperCase(),

      make:
        createDto.make.trim(),

      model:
        createDto.model.trim(),

      variant:
        createDto.variant?.trim() || undefined,

      year:
        createDto.year,

      fuelType:
        createDto.fuelType.trim().toUpperCase(),

      currentMileage:
        createDto.currentMileage,

      color:
        createDto.color.trim(),

      imageUrl:
        createDto.imageUrl?.trim() || undefined,
    });

    return await this.vehicleRepository.save(vehicle);
  }

  // ================================
  // UPDATE VEHICLE
  // ================================
  async updateVehicle(
    id: string,
    updateDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: {
        id,
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }

    Object.assign(vehicle, {
      ...updateDto,

      registrationNumber:
        updateDto.registrationNumber !== undefined
          ? updateDto.registrationNumber.trim().toUpperCase()
          : vehicle.registrationNumber,

      make:
        updateDto.make !== undefined
          ? updateDto.make.trim()
          : vehicle.make,

      model:
        updateDto.model !== undefined
          ? updateDto.model.trim()
          : vehicle.model,

      variant:
        updateDto.variant !== undefined
          ? updateDto.variant?.trim() || undefined
          : vehicle.variant,

      fuelType:
        updateDto.fuelType !== undefined
          ? updateDto.fuelType.trim().toUpperCase()
          : vehicle.fuelType,

      color:
        updateDto.color !== undefined
          ? updateDto.color.trim()
          : vehicle.color,

      imageUrl:
        updateDto.imageUrl !== undefined
          ? updateDto.imageUrl?.trim() || undefined
          : vehicle.imageUrl,
    });

    return await this.vehicleRepository.save(vehicle);
  }

  // ================================
  // DELETE CUSTOMER VEHICLE
  // ================================
  async deleteVehicle(
    id: string,
    customerId: string,
  ): Promise<void> {
    const vehicle = await this.vehicleRepository.findOne({
      where: {
        id,
        customerId,
      },
    });

    if (!vehicle) {
      throw new NotFoundException(
        'Vehicle not found or unauthorized.',
      );
    }

    await this.vehicleRepository.remove(vehicle);
  }

  // ================================
  // ADMIN - DELETE VEHICLE (Naya Add Kiya Hai)
  // ================================
  async remove(id: string): Promise<void> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }

    await this.vehicleRepository.remove(vehicle);
  }
}