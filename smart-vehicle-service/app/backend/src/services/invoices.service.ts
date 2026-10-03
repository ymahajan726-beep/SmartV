import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async findAllInvoices() {
    return this.prisma.invoice.findMany({
      include: {
        customer: { select: { name: true, phone: true } },
        booking: { 
          include: { 
            vehicle: true, 
            service: true, 
            spareParts: true,
            serviceCenter: true 
          } 
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findInvoicesByCustomer(customerId: string) {
    return this.prisma.invoice.findMany({
      where: { customerId },
      include: {
        booking: { 
          include: { 
            vehicle: true, 
            service: true, 
            spareParts: true,
            serviceCenter: true 
          } 
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Dashboard ke liye recent paid invoices fetch karne ka method
  async findRecentPaidInvoices() {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    let invoices = await this.prisma.invoice.findMany({
      where: {
        status: 'PAID',
        createdAt: { gte: twoDaysAgo },
      },
      include: {
        customer: { select: { name: true, phone: true } },
        booking: { 
          include: { 
            vehicle: true, 
            service: true 
          } 
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    if (invoices.length === 0) {
      invoices = await this.prisma.invoice.findMany({
        where: { status: 'PAID' },
        include: {
          customer: { select: { name: true, phone: true } },
          booking: { 
            include: { 
              vehicle: true, 
              service: true 
            } 
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
    }

    return invoices;
  }

  async generateOrGetInvoice(bookingId: string) {
    let invoice = await this.prisma.invoice.findFirst({
      where: { bookingId },
      include: { 
        booking: { 
          include: { 
            vehicle: true, 
            service: true, 
            spareParts: true, 
            serviceCenter: true,
            customer: true
          } 
        }, 
        customer: true 
      }
    });

    if (invoice) return invoice;

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true, service: true, spareParts: true, customer: true, serviceCenter: true }
    });

    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.status !== 'COMPLETED' && booking.status !== 'READY_FOR_DELIVERY') {
      throw new BadRequestException('Invoice can only be generated when vehicle service is Completed or Ready for Delivery.');
    }

    const servicePrice = Number(booking.service?.price || booking.estimatedAmount || 1500);
    const partsTotal = booking.spareParts.reduce((acc, part) => acc + (Number(part.price) * part.quantity), 0);
    const manualLabor = 0.00;
    const subTotal = servicePrice + partsTotal + manualLabor;

    const discount = 0.00;
    const taxableAmount = Math.max(0, subTotal - discount);
    const taxAmount = taxableAmount * 0.18;
    const totalAmount = taxableAmount + taxAmount;

    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        bookingId: booking.id,
        customerId: booking.customerId,
        subTotal: taxableAmount,
        taxAmount,
        discount,
        totalAmount,
        status: 'UNPAID',
      },
      include: { 
        booking: { 
          include: { 
            vehicle: true, 
            service: true, 
            spareParts: true, 
            serviceCenter: true,
            customer: true
          } 
        }, 
        customer: true 
      }
    });

    return invoice;
  }

  async updateManualCharges(invoiceId: string, manualLabor: number, discount: number) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { booking: { include: { service: true, spareParts: true } } }
    });

    if (!invoice) throw new NotFoundException('Invoice not found');
    if (invoice.status === 'PAID') throw new BadRequestException('Paid invoice cannot be modified.');

    const servicePrice = Number(invoice.booking?.service?.price || 1500);
    const partsTotal = invoice.booking?.spareParts?.reduce((acc, p) => acc + (Number(p.price) * p.quantity), 0) || 0;
    
    const subTotal = servicePrice + partsTotal + Number(manualLabor || 0);
    const taxableAmount = Math.max(0, subTotal - Number(discount || 0));
    const taxAmount = taxableAmount * 0.18;
    const totalAmount = taxableAmount + taxAmount;

    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        subTotal: taxableAmount,
        taxAmount,
        discount: Number(discount || 0),
        totalAmount,
      },
      include: { booking: { include: { vehicle: true, service: true, spareParts: true } }, customer: true }
    });
  }

  async updatePaymentStatus(invoiceId: string, paymentMethod: 'CASH' | 'ONLINE') {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { booking: { include: { vehicle: true } } }
    });

    if (!invoice) throw new NotFoundException('Invoice not found');
    if (invoice.status === 'PAID') throw new BadRequestException('Invoice is already paid and locked.');

    const updatedInvoice = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'PAID' }
    });

    await this.prisma.booking.update({
      where: { id: invoice.bookingId },
      data: { 
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        isArchived: true 
      }
    });

    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6);

    await this.prisma.reminder.create({
      data: {
        customerId: invoice.customerId,
        vehicleId: invoice.booking.vehicleId,
        title: `6-Month Periodic Maintenance (${invoice.booking.vehicle?.make || 'Vehicle'})`,
        type: 'SERVICE',
        dueDate: futureDate,
        status: 'PENDING'
      }
    });

    return updatedInvoice;
  }
}