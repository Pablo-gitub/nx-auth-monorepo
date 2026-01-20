import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

import { DB } from '../database/database.module';
import { users, type DbClient } from '@assignment-ftechnology/db';
import type {
  RegisterInput,
  UserPublicDto,
} from '@assignment-ftechnology/contracts';

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

@Injectable()
export class AuthService {
  constructor(@Inject(DB) private readonly db: DbClient) {}

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
}
