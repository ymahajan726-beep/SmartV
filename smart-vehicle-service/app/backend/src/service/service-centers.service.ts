import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCenter } from '../entities/index.js';
import { CreateServiceCenterDto } from '../dto/create-service-center.dto.js';
import { UpdateServiceCenterDto } from '../dto/update-service-center.dto.js';

@Injectable()
export class ServiceCentersService {
  constructor(@InjectRepository(ServiceCenter) private readonly repository: Repository<ServiceCenter>) {}
  findAll() { return this.repository.find({ where: { isActive: true }, order: { name: 'ASC' } }); }
  async findOne(id: string) { const item = await this.repository.findOneBy({ id }); if (!item) throw new NotFoundException('Service center not found.'); return item; }
  create(dto: CreateServiceCenterDto) { return this.repository.save(this.repository.create(dto)); }
  async update(id: string, dto: UpdateServiceCenterDto) { const item = await this.findOne(id); Object.assign(item, dto); return this.repository.save(item); }
  async remove(id: string) { const item = await this.findOne(id); await this.repository.remove(item); return { success: true }; }
}
