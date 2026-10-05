import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.inventoryPart.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: { partName: string; sku?: string; stockQty: number; unitPrice: number }) {
    return this.prisma.inventoryPart.create({
      data: {
        partName: dto.partName,
        sku: dto.sku,
        stockQty: Number(dto.stockQty),
        unitPrice: Number(dto.unitPrice),
      },
    });
  }
  async update(id: string, dto: { partName?: string; sku?: string; stockQty?: number; unitPrice?: number }) {
    const existingPart = await this.prisma.inventoryPart.findUnique({
      where: { id },
    });

    if (!existingPart) {
      throw new NotFoundException(`Spare part with ID ${id} not found in inventory.`);
    }

    return this.prisma.inventoryPart.update({
      where: { id },
      data: {
        ...(dto.partName && { partName: dto.partName }),
        ...(dto.sku !== undefined && { sku: dto.sku }),
        ...(dto.stockQty !== undefined && { stockQty: Number(dto.stockQty) }),
        ...(dto.unitPrice !== undefined && { unitPrice: Number(dto.unitPrice) }),
      },
    });
  }

  async remove(id: string) {
    const existingPart = await this.prisma.inventoryPart.findUnique({
      where: { id },
    });

    if (!existingPart) {
      throw new NotFoundException(`Spare part with ID ${id} not found in inventory.`);
    }

    return this.prisma.inventoryPart.delete({
      where: { id },
    });
  }
}