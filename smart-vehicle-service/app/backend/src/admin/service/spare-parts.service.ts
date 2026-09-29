import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SparePart } from '../entities/spare-part.entity.js';
import { CreateSparePartDto } from '../dto/create-spare-part.dto.js';

@Injectable()
export class SparePartsService {
  constructor(
    @InjectRepository(SparePart)
    private sparePartsRepository: Repository<SparePart>,
  ) {}

  async create(createDto: CreateSparePartDto): Promise<SparePart> {
    const sparePart = this.sparePartsRepository.create(createDto);
    return await this.sparePartsRepository.save(sparePart);
  }

  async findAll(): Promise<SparePart[]> {
    return await this.sparePartsRepository.find({
      relations: {
        serviceCenter: true,
      },
    });
  }

  async findOne(id: string): Promise<SparePart> {
    const part = await this.sparePartsRepository.findOne({
      where: { id },
      relations: {
        serviceCenter: true,
      },
    });
    if (!part) {
      throw new NotFoundException(`Spare part with ID ${id} not found`);
    }
    return part;
  }

  async remove(id: string): Promise<void> {
    const part = await this.findOne(id);
    await this.sparePartsRepository.remove(part);
  }
}