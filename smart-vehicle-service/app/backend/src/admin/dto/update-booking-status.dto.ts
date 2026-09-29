import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookingStatus } from '../../common/enums/app.enums.js';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  @IsNotEmpty()
  status: BookingStatus;
}