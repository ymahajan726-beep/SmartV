import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity.js';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  // == ADMIN: Saare vehicles fetch karne ke liye ==
  async findAllForAdmin(): Promise<Vehicle[]> {
    return await this.vehicleRepository.find({
      relations: {
        customer: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  // == CUSTOMER: Apne vehicles fetch karne ke liye (UUID Validation ke sath) ==
  async findAllForUser(customerId: string): Promise<Vehicle[]> {
    const isValidUuid = (id: string) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(id);
    };

    if (!customerId || !isValidUuid(customerId)) {
      return [];
    }

    return await this.vehicleRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
  }

  async createVehicle(user: { id: string; email?: string }, createDto: any): Promise<Vehicle> {
    const isValidUuid = (id: string) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(id);
    };

    let customerId = user.id;

    // Agar token mein id valid UUID nahi hai (purana token ya phone number), toh DB se fetch karein
    if (!isValidUuid(customerId)) {
      const userRepo = this.vehicleRepository.manager.getRepository('User');
      const foundUser = await userRepo.findOne({
        where: [{ id: customerId as any }, { phone: customerId }, { email: user.email }],
      });

      if (foundUser) {
        customerId = (foundUser as any).id;
      } else {
        throw new NotFoundException('Invalid session. Please logout and login again.');
      }
    }

    const vehicle = this.vehicleRepository.create({
      ...createDto,
      customerId: customerId,
    });
    
    return await this.vehicleRepository.save(vehicle as any);
  }
      

  // == CUSTOMER: Vehicle delete karne ke liye ==
  async deleteVehicle(id: string | number, customerId: string): Promise<void> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: id as any, customerId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found or unauthorized.');
    }

    await this.vehicleRepository.remove(vehicle);
  }
}