import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Aapke project ke hisab se import path check kar lein

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  // --- CUSTOMER: Get Bookings with Center, Vehicle, Service & Spare Parts details ---
  async findBookingsByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { customerId: userId },
      include: {
        vehicle: true,
        serviceCenter: true,
        service: true,
        spareParts: true, // 👈 Spare parts included
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- CUSTOMER: Create Booking with Service Center & Service Package ---
  async createBooking(userId: string, dto: any) {
    const bookingNumber = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    
    let finalAmount = dto.estimatedAmount ? Number(dto.estimatedAmount) : null;
    if (!finalAmount && dto.serviceId) {
      const selectedService = await this.prisma.service.findUnique({
        where: { id: dto.serviceId },
      });
      if (selectedService) {
        finalAmount = Number(selectedService.price);
      }
    }

    return this.prisma.booking.create({
      data: {
        bookingNumber,
        customerId: userId,
        vehicleId: dto.vehicleId,
        serviceCenterId: dto.serviceCenterId || null,
        serviceId: dto.serviceId || null,
        bookingDate: new Date(dto.bookingDate),
        bookingTime: dto.bookingTime || '10:00 AM',
        notes: dto.notes,
        estimatedAmount: finalAmount || 0.00,
        finalAmount: finalAmount || 0.00,
        status: 'BOOKED',
        isArchived: false,
      },
      include: {
        vehicle: true,
        serviceCenter: true,
        service: true,
        spareParts: true,
      },
    });
  }

  // --- CUSTOMER: Update Booking ---
  async updateBookingByCustomer(userId: string, bookingId: string, dto: any) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found.');
    if (booking.customerId !== userId) throw new ForbiddenException('Unauthorized access.');

    let finalAmount = dto.estimatedAmount ? Number(dto.estimatedAmount) : booking.estimatedAmount;
    if (dto.serviceId && dto.serviceId !== booking.serviceId) {
      const selectedService = await this.prisma.service.findUnique({
        where: { id: dto.serviceId },
      });
      if (selectedService) {
        finalAmount = Number(selectedService.price);
      }
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        vehicleId: dto.vehicleId,
        serviceCenterId: dto.serviceCenterId || null,
        serviceId: dto.serviceId || null,
        estimatedAmount: finalAmount,
        finalAmount: finalAmount,
        bookingDate: dto.bookingDate ? new Date(dto.bookingDate) : undefined,
        bookingTime: dto.bookingTime,
        notes: dto.notes,
      },
      include: {
        vehicle: true,
        serviceCenter: true,
        service: true,
        spareParts: true,
      },
    });
  }

  // --- CUSTOMER: Permanent Delete Booking ---
  async cancelBooking(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found.');
    if (booking.customerId !== userId) throw new ForbiddenException('Unauthorized access.');

    return this.prisma.booking.delete({
      where: { id: bookingId },
    });
  }

  // --- ADMIN: Get All Active (Non-Archived) Bookings ---
  async findAllBookingsForAdmin() {
    return this.prisma.booking.findMany({
      where: { isArchived: false }, // 👈 Sirf live/active bookings dikhengi, paid/archived nahi
      include: {
        vehicle: true,
        service: true,
        spareParts: true,
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            address: true,
          },
        },
        serviceCenter: {
          select: {
            id: true,
            name: true,
            location: true, 
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- ADMIN: Get Archived (Completed & Paid) Bookings ---
  async findArchivedBookingsForAdmin() {
    return this.prisma.booking.findMany({
      where: { isArchived: true }, // 👈 Sirf archived bookings
      include: {
        vehicle: true,
        service: true,
        spareParts: true,
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            address: true,
          },
        },
        serviceCenter: {
          select: {
            id: true,
            name: true,
            location: true,
            phone: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // --- ADMIN: Permanent Delete Archived Booking ---
  async permanentDeleteArchivedBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found.');
    
    return this.prisma.booking.delete({
      where: { id: bookingId },
    });
  }

  // --- ADMIN / WORKSHOP: Add Spare Part to Booking & Deduct Inventory Stock ---
  async addSparePartToBooking(bookingId: string, dto: { inventoryPartId: string; quantity: number }) {
    const part = await this.prisma.inventoryPart.findUnique({
      where: { id: dto.inventoryPartId },
    });
    if (!part) throw new NotFoundException('Spare part not found in inventory.');
    
    if (part.stockQty < dto.quantity) {
      throw new BadRequestException(`Insufficient stock! Available: ${part.stockQty}, Requested: ${dto.quantity}`);
    }

    // 1. Deduct stock from inventory
    await this.prisma.inventoryPart.update({
      where: { id: dto.inventoryPartId },
      data: { stockQty: part.stockQty - dto.quantity },
    });

    // 2. Create BookingSparePart record
    const sparePartEntry = await this.prisma.bookingSparePart.create({
      data: {
        bookingId,
        partName: part.partName,
        quantity: Number(dto.quantity),
        price: part.unitPrice,
      },
    });

    // 3. Update Booking's finalAmount automatically (Service Cost + Parts Cost)
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true, spareParts: true },
    });

    const serviceCost = booking?.service?.price ? Number(booking.service.price) : Number(booking?.estimatedAmount || 0);
    const totalPartsCost = booking?.spareParts.reduce((sum, sp) => sum + (Number(sp.price) * sp.quantity), 0) || 0;
    const newFinalAmount = serviceCost + totalPartsCost;

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { finalAmount: newFinalAmount },
    });

    return sparePartEntry;
  }

  // --- ADMIN: Update Status + Trigger WhatsApp/SMS Notification Simulation ---
  async updateBookingStatusByAdmin(bookingId: string, status: any) {
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        customer: { select: { name: true, phone: true } },
        vehicle: { select: { make: true, model: true, registrationNumber: true } },
        serviceCenter: { select: { name: true } },
        service: { select: { name: true } },
      },
    });

    // 🚀 Notification Alert Simulation (WhatsApp / SMS Trigger)
    console.log(`\n========================================`);
    console.log(`[WHATSAPP/SMS ALERT TRIGGERED]`);
    console.log(`To Customer: ${updatedBooking.customer?.name} (${updatedBooking.customer?.phone})`);
    console.log(`Vehicle: ${updatedBooking.vehicle?.make} ${updatedBooking.vehicle?.model} [${updatedBooking.vehicle?.registrationNumber}]`);
    console.log(`Service Package: ${updatedBooking.service?.name || 'General Inspection'}`);
    console.log(`New Service Status: --> ${status} <--`);
    console.log(`Service Center: ${updatedBooking.serviceCenter?.name || 'Main Garage'}`);
    console.log(`========================================\n`);

    return updatedBooking;
  }
}