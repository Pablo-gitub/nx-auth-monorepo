import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * Request enriched by JwtAuthGuard.
 * The guard attaches the authenticated user payload to `req.user`.
 */
type AuthenticatedRequest = Request & {
  user?: {
    sub: string;
    email: string;
  };
};

/**
 * Controller responsible for authenticated user endpoints.
 *
 * All routes in this controller:
 * - require a valid JWT access token
 * - operate on the currently authenticated user ("me")
 */
@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Returns the profile of the currently authenticated user.
   *
   * The user id is extracted from the JWT payload (`req.user.sub`)
   * and resolved via the AuthService.
   */
  @Get()
  async me(@Req() req: AuthenticatedRequest) {
    return this.authService.getMe(req.user?.sub);
  }

  /**
   * Returns the most recent access log entries for the current user.
   * Default limit is 5 (as required by the assignment).
   */
  @Get('access-history')
  async accessHistory(
    @Req() req: AuthenticatedRequest,
    @Query('limit') limit?: string,
  ) {
    const parsed = limit ? Number.parseInt(limit, 10) : 5;
    const safeLimit = Number.isFinite(parsed) ? parsed : 5;

    return this.authService.getAccessHistory(req.user?.sub ?? '', safeLimit);
  }
}
