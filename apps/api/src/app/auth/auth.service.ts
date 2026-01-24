import {
  UnauthorizedException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

import { DB } from '../database/database.module';
import { users, accessLogs, type DbClient } from '@assignment-ftechnology/db';
import type {
  RegisterInput,
  UserPublicDto,
  LoginInput,
  PatchMeInput,
} from '@assignment-ftechnology/contracts';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';

/**
 * Map DB user -> public DTO (never expose passwordHash).
 * Keep it in one place so it’s consistent across register/login/me.
 */
function toUserPublicDto(u: typeof users.$inferSelect): UserPublicDto {
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    birthDate: u.birthDate, // PG date -> string YYYY-MM-DD (ok for DTO)
    avatarUrl: u.avatarUrl ?? null,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  };
}

/**
 * Metadata extracted from the incoming HTTP request.
 * Used for access logging and audit purposes.
 */
type LoginMeta = {
  ipAddress: string | null;
  userAgent: string | null;
};

/**
 * Auth domain service for access tokens, profile update, access history, and avatar upload.
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(DB) private readonly db: DbClient,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Register a new user:
   * - validate happens in controller via ZodValidationPipe
   * - ensure email is unique
   * - hash the password (never store plain text)
   * - insert into DB and return a safe public shape
   */
  async register(input: RegisterInput): Promise<{ user: UserPublicDto }> {
    // 1) Check email duplicate (fast fail)
    const existing = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException({ message: 'Email already in use' });
    }

    // 2) Hash password securely (10 salt rounds is a solid default)
    const passwordHash = await bcrypt.hash(input.password, 10);

    // 3) Insert user
    // NOTE: we do NOT persist confirmPassword (it’s only for FE validation)
    const [created] = await this.db
      .insert(users)
      .values({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        passwordHash,
        birthDate: input.birthDate, // expected YYYY-MM-DD from FE
        avatarUrl: input.avatarUrl ?? null,
      })
      .returning();

    return { user: toUserPublicDto(created) };
  }

  /**
   * Authenticate a user and issue an access token.
   *
   * Step 1: lookup user by email
   * Step 2: verify password with bcrypt.compare
   */
  async login(input: LoginInput, _meta: LoginMeta) {
    const found = await this.db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    const user = found[0];

    // Do not leak whether the email exists or not.
    // Always return the same error for invalid credentials.
    if (!user) {
      throw new UnauthorizedException({ message: 'Invalid credentials' });
    }

    const passwordOk = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordOk) {
      throw new UnauthorizedException({ message: 'Invalid credentials' });
    }

    // Step 3: JWT signing.
    const expiresIn = (
      input.rememberMe
        ? (this.config.get<string>('JWT_REMEMBER_EXPIRES_IN') ?? '30d')
        : (this.config.get<string>('JWT_EXPIRES_IN') ?? '15m')
    ) as StringValue;

    const accessToken = await this.jwt.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      { expiresIn },
    );

    // Step 4: persist access log for audit purposes
    await this.db.insert(accessLogs).values({
      userId: user.id,
      ipAddress: _meta.ipAddress,
      userAgent: _meta.userAgent,
    });

    return {
      accessToken,
      user: toUserPublicDto(user),
    };
  }

  /**
   * Retrieve the profile of the authenticated user.
   *
   * This method is called by JWT-protected routes (e.g. GET /me).
   * It never exposes sensitive fields such as passwordHash.
   */
  async getMe(userId?: string): Promise<{ user: UserPublicDto }> {
    if (!userId) {
      throw new UnauthorizedException({ message: 'Invalid token' });
    }

    const found = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = found[0];

    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    return { user: toUserPublicDto(user) };
  }

  /**
   * Returns the last N access log entries for the authenticated user.
   * Used by the dashboard to display the most recent logins.
   */
  async getAccessHistory(userId: string, limit = 5) {
    const safeLimit = Math.min(Math.max(limit, 1), 50);

    const rows = await this.db
      .select({
        id: accessLogs.id,
        ipAddress: accessLogs.ipAddress,
        userAgent: accessLogs.userAgent,
        createdAt: accessLogs.createdAt,
      })
      .from(accessLogs)
      .where(eq(accessLogs.userId, userId))
      .orderBy(desc(accessLogs.createdAt))
      .limit(safeLimit);

    return {
      items: rows.map((r) => ({
        id: r.id,
        ipAddress: r.ipAddress ?? null,
        userAgent: r.userAgent ?? null,
        createdAt: r.createdAt.toISOString(),
      })),
    };
  }

  async updateAvatar(
    userId: string,
    avatarUrl: string,
  ): Promise<UserPublicDto> {
    const [updated] = await this.db
      .update(users)
      .set({ avatarUrl, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    if (!updated) {
      throw new NotFoundException({ message: 'User not found' });
    }

    return toUserPublicDto(updated);
  }


  /**
   * Profile update (PATCH /me).
   * Security: never allow email/password updates here.
   */
  async updateMe(
    userId?: string,
    input?: PatchMeInput,
  ): Promise<{ user: UserPublicDto }> {
    if (!userId) {
      throw new UnauthorizedException({ message: 'Invalid token' });
    }

    // Build a minimal update patch (only allowed fields)
    const patch: Partial<typeof users.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (input?.firstName !== undefined) patch.firstName = input.firstName;
    if (input?.lastName !== undefined) patch.lastName = input.lastName;
    if (input?.birthDate !== undefined) patch.birthDate = input.birthDate;

    // If only updatedAt would be applied, treat it as invalid input
    const onlyUpdatedAt = Object.keys(patch).length === 1;
    if (onlyUpdatedAt) {
      throw new ConflictException({ message: 'No changes provided' });
    }

    const [updated] = await this.db
      .update(users)
      .set(patch)
      .where(eq(users.id, userId))
      .returning();

    if (!updated) {
      throw new NotFoundException({ message: 'User not found' });
    }

    return { user: toUserPublicDto(updated) };
  }

}
