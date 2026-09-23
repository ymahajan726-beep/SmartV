import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  @IsNotEmpty()
  bookingId: string;

  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsUUID()
  @IsNotEmpty()
  serviceCenterId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}