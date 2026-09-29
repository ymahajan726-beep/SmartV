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

  // Helper: Agar userId phone number ya non-UUID hai, toh DB se valid UUID resolve karega
  private async resolveUserId(userId: string): Promise<string> {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (userId && uuidRegex.test(userId)) {
      return userId;
    }

    try {
      const userRepo = this.vehicleRepository.manager.getRepository('User');
      const foundUser = await userRepo.findOne({
        where: [{ id: userId as any }, { phone: userId }],
      });
      if (foundUser) {
        return (foundUser as any).id;
      }
    } catch (e) {
      // Ignore and fallback
    }

    return userId;
  }

  async findAll(userId: string): Promise<VehicleEntity[]> {
    const resolvedId = await this.resolveUserId(userId);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!resolvedId || !uuidRegex.test(resolvedId)) {
      return []; // Crash hone se bachane ke liye safe empty array
    }

    return await this.vehicleRepository.find({
      where: { userId: resolvedId } as any,
      order: { id: 'DESC' as any },
    });
  }

  async create(userId: string, dto: CreateVehicleDto): Promise<VehicleEntity> {
    const resolvedId = await this.resolveUserId(userId);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!resolvedId || !uuidRegex.test(resolvedId)) {
      throw new NotFoundException('Invalid user session UUID. Please log in again.');
    }

    const newVehicle = this.vehicleRepository.create({
      modelName: dto.modelName,
      vehicleNumber: dto.vehicleNumber,
      fuelType: dto.fuelType,
      mileage: Number(dto.mileage) || 0,
      imageUrl: dto.imageUrl && dto.imageUrl.trim() !== '' ? dto.imageUrl : null,
      userId: resolvedId,
    } as any);

    const result = await this.vehicleRepository.save(newVehicle);
    return Array.isArray(result) ? result[0] : result;
  }

  async remove(userId: string, id: any): Promise<{ success: boolean; message: string }> {
    const resolvedId = await this.resolveUserId(userId);

    const vehicle = await this.vehicleRepository.findOne({
      where: { id, userId: resolvedId } as any,
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found or unauthorized');
    }

    await this.vehicleRepository.remove(vehicle);
    return { success: true, message: 'Vehicle removed successfully' };
  }
}