import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/index.js';
import { RegisterDto } from '../dto/register.dto.js';
import { LoginDto } from '../dto/login.dto.js';
import { UsersService } from './users.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ accessToken: string; user: Partial<User> }> {
    const exists = await this.usersService.findByEmail(registerDto.email);

    if (exists) {
      throw new UnauthorizedException('Email already registered.');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      phone: registerDto.phone,
      passwordHash,
      role: registerDto.role ?? UserRole.CUSTOMER,
      isActive: true,
    });

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: Partial<User> }> {
    // Root Cause Fix: Support login via either email OR phone number
    let user: User | null = null;
    const identifier = loginDto.email; // Yeh login form se email ya phone number kuch bhi ho sakta hai

    if (identifier) {
      if (identifier.includes('@')) {
        user = await this.usersService.findByEmail(identifier);
      } else {
        // Agar phone number diya gaya hai, toh phone se user find karein
        const userRepo = this.usersService['userRepository'] || null; // fallback repository check
        if (userRepo) {
          user = await userRepo.findOne({ where: { phone: identifier } });
        }
      }
    }

    if (!user || !(await bcrypt.compare(loginDto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials (email/phone or password).');
    }

    // Hamesha database ki valid UUID (`user.id`) hi payload mein jayegi
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }
}