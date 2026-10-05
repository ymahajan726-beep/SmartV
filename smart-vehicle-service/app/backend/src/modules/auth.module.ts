import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from '../services/auth.service.js';
import { AuthController } from '../controller/auth.controller.js';
import { JwtStrategy } from '../auth/strategies/jwt.strategy.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CustomerAuthController } from '../controller/customer-auth.controller.js';
import { CustomerAuthService } from '../services/customer-auth.service.js';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],

  controllers: [AuthController, CustomerAuthController],

  providers: [
    AuthService,
    CustomerAuthService,
    JwtStrategy,
  ],

  exports: [
    AuthService,
    JwtStrategy,
    JwtModule,
    PassportModule,
  ],
})
export class AuthModule {}