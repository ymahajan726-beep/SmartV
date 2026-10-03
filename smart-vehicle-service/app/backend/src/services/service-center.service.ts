import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceCenterService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.serviceCenter.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: { name: string; location: string; phone?: string }) {
    return this.prisma.serviceCenter.create({
      data: dto,
    });
  }

  // 👇 Yeh method hona zaroori hai taaki TypeScript error na de
  async update(id: string, dto: { name: string; location: string; phone?: string }) {
    return this.prisma.serviceCenter.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.serviceCenter.delete({
      where: { id },
    });
  }
}