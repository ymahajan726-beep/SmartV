import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RequestOtpDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
  @Matches(/^\d{10}$/, { message: 'Invalid mobile number format' })
  phone: string;
}

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 4, { message: 'OTP must be 4 digits' })
  otp: string;
}