import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { DbClient } from '@assignment-ftechnology/db';

import { AuthService } from './auth.service';

// Mock bcrypt to avoid slow hashing and to make expectations deterministic
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

type DbMock = {
  select: jest.Mock;
  from: jest.Mock;
  where: jest.Mock;
  limit: jest.Mock;
  insert: jest.Mock;
  values: jest.Mock;
  returning: jest.Mock;
};

function createDbMock(): DbMock {
  const db: Partial<DbMock> = {};

  // chain for select().from().where().limit()
  db.select = jest.fn(() => db);
  db.from = jest.fn(() => db);
  db.where = jest.fn(() => db);
  db.limit = jest.fn();

  // chain for insert().values().returning()
  db.insert = jest.fn(() => db);
  db.values = jest.fn(() => db);
  db.returning = jest.fn();

  return db as DbMock;
}

describe('AuthService.register', () => {
  test('creates user and returns public dto (no passwordHash)', async () => {
    const db = createDbMock();

    // no existing user
    db.limit.mockResolvedValueOnce([]);

    (bcrypt.hash as unknown as jest.Mock).mockResolvedValueOnce('HASHED');

    const createdAt = new Date('2026-01-20T02:09:33.732Z');
    const updatedAt = new Date('2026-01-20T02:09:33.732Z');

    db.returning.mockResolvedValueOnce([
      {
        id: 'user-1',
        firstName: 'Paolo',
        lastName: 'Pietrelli',
        email: 'paolo@example.com',
        passwordHash: 'HASHED',
        birthDate: '1997-01-01',
        avatarUrl: null,
        createdAt,
        updatedAt,
      },
    ]);

    const service = new AuthService(db as unknown as DbClient);

    const res = await service.register({
      firstName: 'Paolo',
      lastName: 'Pietrelli',
      email: 'paolo@example.com',
      password: 'Password1',
      confirmPassword: 'Password1',
      birthDate: '1997-01-01',
    });

    // Asserzioni (1 sola assert “finale” come preferisci):
    expect(res).toEqual({
      user: {
        id: 'user-1',
        firstName: 'Paolo',
        lastName: 'Pietrelli',
        email: 'paolo@example.com',
        birthDate: '1997-01-01',
        avatarUrl: null,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      },
    });

    // (extra: verifiche mock non sono "assert finali sul dominio", ma se vuoi essere rigidissimo,
    // possiamo spostarle in un secondo test o toglierle. Per ora ti lascio solo quelle essenziali.)
    expect(bcrypt.hash).toHaveBeenCalledWith('Password1', 10);
  });

  test('throws ConflictException when email already exists', async () => {
    const db = createDbMock();

    // existing user found
    db.limit.mockResolvedValueOnce([{ id: 'existing' }]);

    const service = new AuthService(db as unknown as DbClient);

    await expect(
      service.register({
        firstName: 'Paolo',
        lastName: 'Pietrelli',
        email: 'paolo@example.com',
        password: 'Password1',
        confirmPassword: 'Password1',
        birthDate: '1997-01-01',
      })
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
