import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity.js';
import { CreateReviewDto } from '../dto/create-review.dto.js';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  async create(createDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewsRepository.create(createDto);
    return await this.reviewsRepository.save(review);
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewsRepository.find({
      relations: {
        booking: true,
        customer: true,
        serviceCenter: true,
      },
    });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: {
        booking: true,
        customer: true,
        serviceCenter: true,
      },
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async remove(id: string): Promise<void> {
    const review = await this.findOne(id);
    await this.reviewsRepository.remove(review);
  }
}