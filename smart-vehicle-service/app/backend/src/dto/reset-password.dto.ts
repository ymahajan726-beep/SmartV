import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  token: string; // Reset token ya OTP jo email par ya response mein milega

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}