import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../admin/entities/index.js'; // Global/Admin entity use karein

@Injectable()
export class CustomerBookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  // Customer apni booking create karega
  async createBooking(customerId: string, data: Partial<Booking>): Promise<Booking> {
    const booking = this.bookingRepository.create({
      ...data,
      customerId: customerId, // Customer ID map ho jayegi
    });
    return await this.bookingRepository.save(booking);
  }

  // Customer sirf apni bookings dekh sakega
  async findAllForCustomer(customerId: string): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { customerId: customerId },
      order: { createdAt: 'DESC' },
    });
  }

  // == ADMIN REQUIREMENT: Admin ke liye saare customers ki bookings fetch karna ==
  async findAllForAdmin(): Promise<Booking[]> {
    return await this.bookingRepository.find({
      order: { createdAt: 'DESC' },
    }); // Yahan koi filter nahi hai, toh saari bookings admin ko dikhengi
  }
}