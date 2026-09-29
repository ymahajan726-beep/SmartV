import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/index.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
      relations: { serviceCenter: true },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: { serviceCenter: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: { serviceCenter: true },
    });
  }

  async create(data: Partial<User> & { password?: string }): Promise<User> {
    const allowedRoles = ['ADMIN', 'CUSTOMER', 'MANAGER', 'STAFF'];
    let assignedRole = data.role ? String(data.role).toUpperCase() : 'CUSTOMER';
    
    if (!allowedRoles.includes(assignedRole)) {
      assignedRole = 'CUSTOMER';
    }

    // Frontend se 'password' milta hai, lekin database column 'passwordHash' hai
    const plainPassword = data.password || 'defaultPassword123';

    const payload = {
      ...data,
      role: assignedRole,
      passwordHash: plainPassword, // Database constraint fix karne ke liye map kiya gaya
    };

    // Remove raw password property if it exists in data to avoid entity conflicts
    delete (payload as any).password;

    const user = this.userRepository.create(payload as any);
    return await this.userRepository.save(user as any);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    await this.userRepository.remove(user);
  }
}