import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerUpdateProfileDto } from '../dto/customer-update-profile.dto';

@Injectable()
export class CustomerUsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        vehicles: true,
        bookings: { include: { service: true, serviceCenter: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('Customer profile not found');
    }
    return user;
  }

  async updateProfile(userId: string, dto: CustomerUpdateProfileDto) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: { id: true, name: true, email: true, phone: true, address: true },
    });
    return { message: 'Profile updated successfully', data: updated };
  }
}