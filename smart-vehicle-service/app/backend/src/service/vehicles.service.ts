import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Vehicle } from '../entities/index.js';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async createVehicle(user: User, data: Partial<Vehicle>): Promise<Vehicle> {
    const normalized = data.registrationNumber?.trim();

    if (!normalized) {
      throw new BadRequestException('Registration number is required.');
    }

    const exists = await this.vehicleRepository.findOne({
      where: { registrationNumber: normalized },
    });

    if (exists) {
      throw new BadRequestException('Vehicle registration number already exists.');
    }

    const vehicle = this.vehicleRepository.create({
      ...data,
      customerId: user.id,
      registrationNumber: normalized,
    });

    return this.vehicleRepository.save(vehicle);
  }

  async findAllForUser(userId: string): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: { customerId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneForUser(vehicleId: string, userId: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId, customerId: userId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }

    return vehicle;
  }

  async updateVehicle(vehicleId: string, userId: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId, customerId: userId },
    });

    if (!vehicle) {
      throw new UnauthorizedException('You do not own this vehicle.');
    }

    if (data.registrationNumber) {
      const existing = await this.vehicleRepository.findOne({
        where: { registrationNumber: data.registrationNumber.trim() },
      });

      if (existing && existing.id !== vehicleId) {
        throw new BadRequestException('Vehicle registration number already exists.');
      }

      vehicle.registrationNumber = data.registrationNumber.trim();
    }

    Object.assign(vehicle, data);
    return this.vehicleRepository.save(vehicle);
  }

  async deleteVehicle(vehicleId: string, userId: string): Promise<void> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId, customerId: userId },
    });

    if (!vehicle) {
      throw new UnauthorizedException('You do not own this vehicle.');
    }

    await this.vehicleRepository.remove(vehicle);
  }
}
