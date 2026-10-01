import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class AdminUsersService {
  constructor(private prisma: PrismaService) {}

  // Register / Create Staff Member with safe Prisma Role Mapping
  async createStaff(dto: any) {
    const { name, email, phone, password, role } = dto;

    const existingUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password || 'default123', 10);

    let assignedRole: Role = Role.WORKSHOP;
    const upperRole = String(role || '').toUpperCase();
    
    if (upperRole === 'ADMIN') {
      assignedRole = Role.ADMIN;
    } else if (upperRole === 'CUSTOMER') {
      assignedRole = Role.CUSTOMER;
    } else {
      assignedRole = Role.WORKSHOP;
    }

    const newUser = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        name,
        email,
        phone: phone || null,
        passwordHash: hashedPassword,
        role: assignedRole,
        isActive: true,
      },
    });

    return {
      message: 'Staff registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  // Customer Directory for Admin Dashboard
  async findAllCustomers() {
    return this.prisma.user.findMany({
      where: { role: Role.CUSTOMER },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        isActive: true,
        createdAt: true,
        _count: { select: { vehicles: true, bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Staff / Workshop Directory for Admin Dashboard
  async findAllStaff() {
    return this.prisma.user.findMany({
      where: { role: { in: [Role.ADMIN, Role.WORKSHOP] } },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { vehicles: true, bookings: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, dto: any) {
    const existingUser = await this.findUserById(id);

    // Agar frontend se role nahi aaya hai, toh purana role hi retain rakhein
    let assignedRole = existingUser.role; 

    if (dto.role) {
      const upperRole = String(dto.role).toUpperCase();
      if (upperRole === 'ADMIN') {
        assignedRole = Role.ADMIN;
      } else if (upperRole === 'CUSTOMER') {
        assignedRole = Role.CUSTOMER;
      } else {
        assignedRole = Role.WORKSHOP;
      }
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        role: assignedRole, // Safe role mapping taaki customer idhar-udhar na jaye
      },
    });

    return { message: 'User updated successfully by admin', data: updated };
  }

  async deleteUser(id: string) {
    await this.findUserById(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
  async getDashboardStats() {
  const totalVehicles = await this.prisma.vehicle.count();
  const totalCustomers = await this.prisma.user.count({ where: { role: Role.CUSTOMER } });
  const totalBookings = await this.prisma.booking.count().catch(() => 0);

  return {
    totalVehicles,
    totalCustomers,
    totalBookings,
  };
}
}