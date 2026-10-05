import { Module } from '@nestjs/common';
import { ReviewService } from '../services/reviews.service';
import { ReviewController } from '../controller/reviews.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [PrismaModule,AuthModule], 
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}