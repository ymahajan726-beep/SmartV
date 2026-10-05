import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class CustomerVehiclesService {
  constructor(private prisma: PrismaService) {}

  async findVehiclesByUser(userId: string) {
    return this.prisma.vehicle.findMany({
      where: { customerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createVehicle(userId: string, dto: any) {
    const { 
      registrationNumber, 
      make, 
      model, 
      variant, 
      year, 
      fuelType, 
      currentMileage, 
      color, 
      imageUrl 
    } = dto;

    return this.prisma.vehicle.create({
      data: {
        id: randomUUID(),
        registrationNumber: registrationNumber || 'MH-04-XX-0000',
        make: make || 'Unknown',
        model: model || 'Standard Model',
        variant: variant || null,
        year: year ? Number(year) : new Date().getFullYear(),
        fuelType: fuelType || 'PETROL',
        currentMileage: currentMileage ? Number(currentMileage) : 0,
        color: color || 'White',
        imageUrl: imageUrl || null,
        customerId: userId,
      },
    });
  }
  async updateVehicle(userId: string, vehicleId: string, dto: any) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }

    if (vehicle.customerId !== userId) {
      throw new ForbiddenException('You are not authorized to modify this vehicle.');
    }

    const { 
      registrationNumber, 
      make, 
      model, 
      variant, 
      year, 
      fuelType, 
      currentMileage, 
      color, 
      imageUrl 
    } = dto;

    return this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        registrationNumber: registrationNumber !== undefined ? registrationNumber : vehicle.registrationNumber,
        make: make !== undefined ? make : vehicle.make,
        model: model !== undefined ? model : vehicle.model,
        variant: variant !== undefined ? variant : vehicle.variant,
        year: year !== undefined ? Number(year) : vehicle.year,
        fuelType: fuelType !== undefined ? fuelType : vehicle.fuelType,
        currentMileage: currentMileage !== undefined ? Number(currentMileage) : vehicle.currentMileage,
        color: color !== undefined ? color : vehicle.color,
        imageUrl: imageUrl !== undefined ? imageUrl : vehicle.imageUrl,
      },
    });
  }
  async deleteVehicle(userId: string, vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }

    if (vehicle.customerId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this vehicle.');
    }

    return this.prisma.vehicle.delete({
      where: { id: vehicleId },
    });
  }
}