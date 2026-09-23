import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity.js';

@Injectable()
export class ServiceHistoryService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async getVehicleHistory(vehicleId: string): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { vehicleId },
      relations: {
        service: true,
        serviceCenter: true,
        invoices: true,
        review: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getCustomerHistory(customerId: string): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { customerId },
      relations: {
        vehicle: true,
        service: true,
        serviceCenter: true,
        invoices: true,
        review: true,
      },
      order: { createdAt: 'DESC' },
    });
  }
}