import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity.js';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  // Customer ke liye vehicle create karne ka method
  async createVehicle(userId: string, data: { vehicleNumber: string; modelName: string; fuelType?: string; mileage?: number; imageUrl?: string }) {
    const normalized = data.vehicleNumber?.trim();
    if (!normalized) {
      throw new BadRequestException('Vehicle number is required');
    }

    const existing = await this.vehicleRepository.findOne({
      where: { vehicleNumber: normalized },
    });
    if (existing) {
      throw new BadRequestException('Vehicle with this number already exists');
    }

    const vehicle = this.vehicleRepository.create({
      ...data,
      vehicleNumber: normalized,
      userId,
      customerId: userId,
    });

    return await this.vehicleRepository.save(vehicle);
  }

  // Admin ke liye saari vehicles fetch karne ka method
  async findAllForAdmin(): Promise<Vehicle[]> {
    return await this.vehicleRepository.find({
      relations: { customer: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllForUser(userId: string): Promise<Vehicle[]>{
    return await this.vehicleRepository.find({
      where: { customerId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(vehicleId: number, userId?: string): Promise<Vehicle> {
    const query: any = { id: Number(vehicleId) };
    if (userId) query.customerId = userId;

    const vehicle = await this.vehicleRepository.findOne({ where: query });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }

  // Customer ke liye vehicle delete karne ka method
  async deleteVehicle(vehicleId: number, userId: string): Promise<void> {
    const vehicle = await this.findOne(vehicleId, userId);
    await this.vehicleRepository.remove(vehicle);
  }

  async remove(vehicleId: number, userId: string): Promise<void> {
    await this.deleteVehicle(vehicleId, userId);
  }
}