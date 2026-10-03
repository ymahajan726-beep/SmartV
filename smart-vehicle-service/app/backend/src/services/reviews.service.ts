import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  // --- CUSTOMER: Create or Submit Review for a Booking ---
  async createReview(customerId: string, dto: { bookingId: string; rating: number; comment?: string }) {
    // 1. Check if booking exists and belongs to customer
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { invoices: true },
    });

    if (!booking) throw new NotFoundException('Booking not found.');
    if (booking.customerId !== customerId) throw new ForbiddenException('Unauthorized access.');

    // 2. Check if booking is completed or paid
    const isPaid = booking.invoices.some(inv => inv.status === 'PAID') || booking.paymentStatus === 'PAID';
    if (!isPaid && booking.status !== 'COMPLETED') {
      throw new BadRequestException('You can only review completed or paid service bookings.');
    }

    // 3. Check if review already exists for this booking
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

    // 4. Create new review (By default high ratings like 4 or 5 can be featured on landing page)
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

  // --- CUSTOMER: Get My Reviews ---
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

  // --- ADMIN: Get All Reviews ---
  async getAllReviewsForAdmin() {
    return this.prisma.review.findMany({
      include: {
        customer: { select: { name: true, email: true, phone: true } },
        booking: { include: { vehicle: true, service: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- PUBLIC: Get Featured Reviews for Landing Page ---
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

  // --- ADMIN / OWNER: Delete Review ---
  async deleteReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found.');

    return this.prisma.review.delete({
      where: { id },
    });
  }

  // --- ADMIN: Toggle Featured Status for Landing Page ---
  async toggleFeatureReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found.');

    return this.prisma.review.update({
      where: { id },
      data: { isFeatured: !review.isFeatured },
    });
  }
}