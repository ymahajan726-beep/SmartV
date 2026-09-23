import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../entities/index.js';
import { CreateServiceDto } from '../dto/create-service.dto.js';
import { UpdateServiceDto } from '../dto/update-service.dto.js';

@Injectable()
export class ServicesService {
  constructor(@InjectRepository(Service) private readonly repository: Repository<Service>) {}

  findAll() {
    return this.repository.find({ where: { isActive: true }, order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const service = await this.repository.findOneBy({ id });
    if (!service) throw new NotFoundException('Service not found.');
    return service;
  }

  create(dto: CreateServiceDto) { return this.repository.save(this.repository.create(dto)); }

  async update(id: string, dto: UpdateServiceDto) {
    const service = await this.findOne(id);
    Object.assign(service, dto);
    return this.repository.save(service);
  }

  async remove(id: string) {
    const service = await this.findOne(id);
    await this.repository.remove(service);
    return { success: true };
  }
}
