import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async findBookingsByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { customerId: userId },
      include: {
        vehicle: true,
        serviceCenter: true,
        service: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createBooking(userId: string, dto: any) {
    const { vehicleId, serviceCenterId, serviceId, bookingDate, bookingTime, notes, estimatedAmount } = dto;
    const bookingNumber = `BK-${Math.floor(100000 + Math.random() * 900000)}`;

    return this.prisma.booking.create({
      data: {
        id: randomUUID(),
        bookingNumber,
        customerId: userId,
        vehicleId,
        serviceCenterId: serviceCenterId || null,
        serviceId: serviceId || null,
        bookingDate: new Date(bookingDate),
        bookingTime: bookingTime || '10:00 AM',
        notes: notes || null,
        
        status: 'BOOKED',
        paymentStatus: 'UNPAID',
      },
      include: {
        vehicle: true,
        serviceCenter: true,
      },
    });
  }

  async updateBookingByCustomer(userId: string, bookingId: string, dto: any) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found.');
    if (booking.customerId !== userId) throw new ForbiddenException('Unauthorized access.');

    const { vehicleId, bookingDate, bookingTime, notes } = dto;

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        vehicleId: vehicleId || booking.vehicleId,
        bookingDate: bookingDate ? new Date(bookingDate) : booking.bookingDate,
        bookingTime: bookingTime || booking.bookingTime,
        notes: notes !== undefined ? notes : booking.notes,
      },
    });
  }

  async cancelBooking(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found.');
    if (booking.customerId !== userId) throw new ForbiddenException('Unauthorized access.');

    // Yeh sirf Booking table se row delete karega, Vehicle ko kuch nahi hoga
    return this.prisma.booking.delete({
      where: { id: bookingId },
    });
  }
  // Admin methods
  async findAllBookingsForAdmin() {
    return this.prisma.booking.findMany({
      include: {
        customer: { select: { name: true, phone: true, email: true } },
        vehicle: true,
        serviceCenter: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateBookingStatusByAdmin(bookingId: string, status: any) {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
  }
}