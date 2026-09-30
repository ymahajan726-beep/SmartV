import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../admin/entities/booking.entity.js';
import { BookingStatus, PaymentStatus } from '../../common/enums/app.enums.js';

@Injectable()
export class CustomerBookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async findAllForCustomer(customerId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { customerId },
      relations: {
        vehicle: true,
        service: true,
        serviceCenter: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async create(customerId: string, dto: any): Promise<Booking> {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const bookingNumber = `BK-${randomNum}`;

    // Helper function to validate UUID format
    const isValidUuid = (id: string) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(id);
    };

    const serviceId = dto.serviceId && isValidUuid(dto.serviceId) ? dto.serviceId : null;
    const serviceCenterId = dto.serviceCenterId && isValidUuid(dto.serviceCenterId) ? dto.serviceCenterId : null;

    // Dynamic amount support: agar DTO mein amount di hai toh wohi lo, nahi toh default 1499.00
    const estimatedAmount = dto.estimatedAmount !== undefined ? Number(dto.estimatedAmount) : 1499.00;

    const newBooking = this.bookingRepository.create({
      bookingNumber,
      customerId,
      vehicleId: Number(dto.vehicleId),
      serviceId,
      serviceCenterId,
      bookingDate: dto.bookingDate,
      bookingTime: '10:00:00',
      notes: dto.notes || '',
      estimatedAmount,
      status: BookingStatus.BOOKED,
      paymentStatus: PaymentStatus.UNPAID,
    } as any);

    await this.bookingRepository.save(newBooking as any);

    // FIX: Dobara saari bookings list fetch karke return kar do jisme relations already loaded hain
    const allBookings = await this.findAllForCustomer(customerId);
    return allBookings[0] as Booking;
  }
}