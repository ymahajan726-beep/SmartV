import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {  Vehicle, Service, ServiceCenter } from '../entities/index.js';
import { CreateBookingDto } from '../dto/create-booking.dto.js';
import { UpdateBookingDto } from '../dto/update-booking.dto.js';
import { Booking } from '../entities/booking.entity.js';
import { BookingStatus } from '../common/enums/app.enums.js';
@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServiceCenter)
    private readonly serviceCenterRepository: Repository<ServiceCenter>,
  ) {}

  async create(customerId: string, createBookingDto: CreateBookingDto): Promise<Booking> {
    // 1. Verify Vehicle belongs to user
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: createBookingDto.vehicleId, customerId },
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found or does not belong to user.');
    }

    // 2. Verify Service exists
    const service = await this.serviceRepository.findOne({
      where: { id: createBookingDto.serviceId, isActive: true },
    });
    if (!service) {
      throw new NotFoundException('Service not found or inactive.');
    }

    // 3. Verify Service Center exists
    const center = await this.serviceCenterRepository.findOne({
      where: { id: createBookingDto.serviceCenterId, isActive: true },
    });
    if (!center) {
      throw new NotFoundException('Service center not found or inactive.');
    }

    // 4. Generate unique booking number
    const bookingNumber = 'BK-' + Date.now().toString().slice(-8);

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      customerId,
      bookingNumber,
      estimatedAmount: service.basePrice,
      status: BookingStatus.BOOKED,
    });

    return await this.bookingRepository.save(booking);
  }

  async findAllForCustomer(customerId: string): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { customerId },
      relations: {
      vehicle: true,
      service: true,
      serviceCenter: true,
    },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, customerId?: string): Promise<Booking> {
    const query: any = { id };
    if (customerId) query.customerId = customerId;

    const booking = await this.bookingRepository.findOne({
      where: query,
      relations: {
      vehicle: true,
      service: true,
      serviceCenter: true,
      bookingSpareParts: true,
      invoices: true,
    },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found.');
    }
    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);
    Object.assign(booking, updateBookingDto);
    return await this.bookingRepository.save(booking);
  }

  async cancel(id: string, customerId: string): Promise<Booking> {
    const booking = await this.findOne(id, customerId);
    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Completed bookings cannot be cancelled.');
    }
    booking.status = BookingStatus.CANCELLED;
    return await this.bookingRepository.save(booking);
  }
}