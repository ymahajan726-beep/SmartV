import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminVehiclesService {
  constructor(private prisma: PrismaService) {}

  async findAllVehiclesWithOwners() {
    return this.prisma.vehicle.findMany({
      include: {
        customer: { 
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}