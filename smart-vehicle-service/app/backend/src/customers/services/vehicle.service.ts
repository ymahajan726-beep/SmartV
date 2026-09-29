import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from '../entities/vehicle.entity';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async findAll(userId: string): Promise<VehicleEntity[]> {
    return await this.vehicleRepository.find({
      where: { userId: userId }, // Sirf specific user ke vehicles filter honge
      order: { id: 'DESC' as any },
    });
  }

  async create(userId: string, dto: CreateVehicleDto): Promise<VehicleEntity> {
    const newVehicle = this.vehicleRepository.create({
      modelName: dto.modelName,
      vehicleNumber: dto.vehicleNumber,
      fuelType: dto.fuelType,
      mileage: Number(dto.mileage) || 0,
      imageUrl: dto.imageUrl && dto.imageUrl.trim() !== '' ? dto.imageUrl : null,
      userId: userId,
    } as any);

    const result = await this.vehicleRepository.save(newVehicle);
    return Array.isArray(result) ? result[0] : result;
  }

  async remove(userId: string, id: any): Promise<{ success: boolean; message: string }> {
    // Yeh ensure karta hai ki user sirf apna hi vehicle delete kar sake
    const vehicle = await this.vehicleRepository.findOne({
      where: { id, userId } as any,
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found or unauthorized');
    }

    await this.vehicleRepository.remove(vehicle);
    return { success: true, message: 'Vehicle removed successfully' };
  }
}