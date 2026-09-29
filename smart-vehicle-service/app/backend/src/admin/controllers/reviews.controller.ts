import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from '../service/reviews.service.js';
import { CreateReviewDto } from '../dto/create-review.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  // 🔥 Added for Admin Landing Page Curation (Toggling Featured status)
  @Patch(':id/feature')
  toggleFeature(@Param('id') id: string, @Body() body: { isFeatured: boolean }) {
    return this.reviewsService.toggleFeature(id, body.isFeatured);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}