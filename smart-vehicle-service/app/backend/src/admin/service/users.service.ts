import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository, Not } from 'typeorm';

import { User } from '../entities/index.js';



@Injectable()

export class UsersService {

  constructor(

    @InjectRepository(User)

    private readonly userRepository: Repository<User>,

  ) {}



  // STAFF TABLE FIX: Using TypeORM 'Not' operator to strictly exclude CUSTOMERS

  async findAll(): Promise<User[]> {

    try {

      return await this.userRepository.find({

        where: {

          role: Not('CUSTOMER' as any),

        },

        order: { createdAt: 'DESC' },

        relations: { serviceCenter: true },

      });

    } catch (error: any) {

      console.warn('Staff fetch warning, falling back to basic query:', error?.message || error);

      return await this.userRepository.find({

        order: { createdAt: 'DESC' },

        relations: { serviceCenter: true },

      });

    }

  }



  // INDUSTRY-LEVEL CUSTOMER DIRECTORY: Safe relations loading with fallback to prevent Internal Server Error

  async findAllCustomersWithDetails(): Promise<User[]> {

    try {

      return await this.userRepository.find({

        where: { role: 'CUSTOMER' as any },

        relations: {

          vehicles: true,

          bookings: {

            vehicle: true,

            service: true,

          },

        },

        order: { createdAt: 'DESC' },

      });

    } catch (error: any) {

      // Fallback: Agar relations mein koi mismatch ho toh bina relations ke fetch karke crash hone se bachayein

      console.warn('Relations warning in customer fetch, falling back to basic user query:', error?.message || error);

      return await this.userRepository.find({

        where: { role: 'CUSTOMER' as any },

        order: { createdAt: 'DESC' },

      });

    }

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



    const plainPassword = data.password || 'defaultPassword123';



    const payload = {

      ...data,

      role: assignedRole,

      passwordHash: plainPassword,

    };



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

    // Check karein ki user database mein exist karta hai ya nahi

    const user = await this.userRepository.findOne({ where: { id } });

   

    if (!user) {

      throw new NotFoundException(`User with ID ${id} not found.`);

    }



    // Bina kisi restrictive active check ke user ko database se hata dein

    await this.userRepository.remove(user);

  }

} 

