import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

import { DatabaseModule } from '../database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MeController } from './me.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AvatarController } from './avatar.controller';

/**
 * Authentication module.
 *
 * This module is responsible for:
 * - user registration and login
 * - JWT configuration and token signing
 * - protection of authenticated routes via JwtAuthGuard
 *
 * JWT configuration is resolved asynchronously in order to:
 * - read secrets and expiration values from environment variables
 * - keep the module easily configurable across environments
 */
@Module({
  imports: [
    DatabaseModule,

    /**
     * JWT module configuration.
     *
     * The configuration is resolved at runtime using ConfigService,
     * allowing different secrets and expiration policies per environment.
     */
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET') ?? 'dev_secret';

        // Default short-lived access token (overridden in AuthService when "remember me" is enabled)
        const expiresIn = (config.get<string>('JWT_EXPIRES_IN') ??
          '15m') as StringValue;

        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],

  /**
   * Controllers exposed by the authentication module.
   * - AuthController: public auth endpoints (register, login)
   * - MeController: JWT-protected endpoints for the authenticated user
   */
  controllers: [AuthController, MeController, AvatarController],

  /**
   * Providers registered by this module.
   * - AuthService: authentication business logic
   * - JwtAuthGuard: route protection based on Bearer JWT tokens
   */
  providers: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
