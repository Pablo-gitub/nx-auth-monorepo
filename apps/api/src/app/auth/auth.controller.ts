import { Body, Controller, Post, Req } from '@nestjs/common';
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from '@assignment-ftechnology/contracts';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body(new ZodValidationPipe(registerSchema)) body: RegisterInput) {
    return this.authService.register(body);
  }

  @Post('login')
  login(
    @Body(new ZodValidationPipe(loginSchema)) body: LoginInput,
    @Req() req: Request
  ) {
    const ipAddress =
      (req.headers['x-forwarded-for'] as string | undefined)
        ?.split(',')[0]
        ?.trim() ??
      req.socket?.remoteAddress ??
      null;

    const userAgent = req.headers['user-agent'] ?? null;

    return this.authService.login(body, { ipAddress, userAgent });
  }
}
