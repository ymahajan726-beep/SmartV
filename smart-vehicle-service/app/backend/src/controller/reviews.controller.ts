import { Controller, Get, Post, Delete, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ReviewService } from '../services/reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Public Landing Page Testimonials
  @Get('public')
  getPublicReviews() {
    return this.reviewService.getPublicFeaturedReviews();
  }

  // Customer Reviews
  @Get('customer')
  @UseGuards(JwtAuthGuard)
  getCustomerReviews(@Req() req: any) {
    const userId = req.user.userId || req.user.id;
    return this.reviewService.getReviewsByUser(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createReview(@Req() req: any, @Body() dto: { bookingId: string; rating: number; comment?: string }) {
    const userId = req.user.userId || req.user.id;
    return this.reviewService.createReview(userId, dto);
  }

  // Admin Reviews Moderation
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
 //@Roles(Role.ADMIN)
  getAllAdminReviews() {
    return this.reviewService.getAllReviewsForAdmin();
  }

  @Patch('admin/:id/feature')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  toggleFeature(@Param('id') id: string) {
    return this.reviewService.toggleFeatureReview(id);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  deleteReview(@Param('id') id: string) {
    return this.reviewService.deleteReview(id);
  }
}