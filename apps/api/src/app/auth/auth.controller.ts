import { Body, Controller, Post } from '@nestjs/common';
import {
  registerSchema,
  type RegisterInput,
} from '@assignment-ftechnology/contracts';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  @Post('register')
  register(@Body(new ZodValidationPipe(registerSchema)) _body: RegisterInput) {
    return { ok: true };
  }
}
