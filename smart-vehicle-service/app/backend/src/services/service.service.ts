import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(serviceCenterId?: string) {
    return this.prisma.service.findMany({
      where: serviceCenterId ? { serviceCenterId } : {},
      include: { serviceCenter: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: { name: string; description?: string; price: number; duration?: string; serviceCenterId: string }) {
    return this.prisma.service.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: Number(dto.price),
        duration: dto.duration,
        serviceCenterId: dto.serviceCenterId,
      },
    });
  }

  async update(id: string, dto: { name: string; description?: string; price: number; duration?: string; serviceCenterId: string }) {
    return this.prisma.service.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        price: Number(dto.price),
        duration: dto.duration,
        serviceCenterId: dto.serviceCenterId,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.service.delete({
      where: { id },
    });
  }
}