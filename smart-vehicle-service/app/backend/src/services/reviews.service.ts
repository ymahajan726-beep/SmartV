import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(customerId: string, dto: { bookingId: string; rating: number; comment?: string }) {
    // 1. Check if booking exists and belongs to customer
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { invoices: true },
    });

    if (!booking) throw new NotFoundException('Booking not found.');
    if (booking.customerId !== customerId) throw new ForbiddenException('Unauthorized access.');

    const isPaid = booking.invoices.some(inv => inv.status === 'PAID') || booking.paymentStatus === 'PAID';
    if (!isPaid && booking.status !== 'COMPLETED') {
      throw new BadRequestException('You can only review completed or paid service bookings.');
    }
    const existingReview = await this.prisma.review.findUnique({
      where: { bookingId: dto.bookingId },
    });

    if (existingReview) {
      // Update existing review if already submitted
      return this.prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating: Number(dto.rating),
          comment: dto.comment,
        },
      });
    }
    const isFeatured = Number(dto.rating) >= 4;

    return this.prisma.review.create({
      data: {
        bookingId: dto.bookingId,
        customerId,
        rating: Number(dto.rating),
        comment: dto.comment,
        isFeatured,
      },
    });
  }

  async getReviewsByUser(customerId: string) {
    return this.prisma.review.findMany({
      where: { customerId },
      include: {
        booking: {
          include: {
            vehicle: true,
            service: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllReviewsForAdmin() {
    return this.prisma.review.findMany({
      include: {
        customer: { select: { name: true, email: true, phone: true } },
        booking: { include: { vehicle: true, service: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  async getPublicFeaturedReviews() {
    return this.prisma.review.findMany({
      where: { isFeatured: true, rating: { gte: 4 } },
      take: 6,
      include: {
        customer: { select: { name: true } },
        booking: { include: { vehicle: { select: { make: true, model: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found.');

    return this.prisma.review.delete({
      where: { id },
    });
  }

  async toggleFeatureReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found.');

    return this.prisma.review.update({
      where: { id },
      data: { isFeatured: !review.isFeatured },
    });
  }
}