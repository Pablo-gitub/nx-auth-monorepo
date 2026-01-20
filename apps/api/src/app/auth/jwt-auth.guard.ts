import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

/**
 * JWT payload we put inside access tokens.
 * - `sub` is the user id (standard JWT subject claim)
 * - `email` is convenient for debugging and UI needs
 */
export type JwtPayload = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

/**
 * Express request extended with an authenticated `user` payload.
 * We attach this during authentication so controllers can read `req.user.sub`.
 */
export type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};

/**
 * Guard that protects routes by validating a Bearer JWT access token.
 *
 * Expected header:
 *   Authorization: Bearer <token>
 *
 * On success:
 * - the token is verified using JwtService (uses JWT_SECRET)
 * - the decoded payload is attached to `req.user`
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authHeader = req.get('authorization');
    if (!authHeader) {
      throw new UnauthorizedException({
        message: 'Missing Authorization header',
      });
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException({
        message: 'Invalid Authorization header',
      });
    }

    try {
      const payload = (await this.jwt.verifyAsync(token)) as JwtPayload;
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException({ message: 'Invalid token' });
    }
  }
}
