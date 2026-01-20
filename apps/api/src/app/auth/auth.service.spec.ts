import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { DbClient } from '@assignment-ftechnology/db';
import type { JwtService } from '@nestjs/jwt';
import type { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

// Mock bcrypt to avoid slow hashing and to make expectations deterministic
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
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

const jwtMock = {
  signAsync: jest.fn(),
};

const configMock = {
  get: jest.fn(),
};

describe('AuthService.register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

    const service = new AuthService(
      db as unknown as DbClient,
      jwtMock as unknown as JwtService,
      configMock as unknown as ConfigService,
    );

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

    const service = new AuthService(
      db as unknown as DbClient,
      jwtMock as unknown as JwtService,
      configMock as unknown as ConfigService,
    );

    await expect(
      service.register({
        firstName: 'Paolo',
        lastName: 'Pietrelli',
        email: 'paolo@example.com',
        password: 'Password1',
        confirmPassword: 'Password1',
        birthDate: '1997-01-01',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});

describe('AuthService.login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('throws UnauthorizedException when user does not exist', async () => {
    const db = createDbMock();

    // lookup: no user
    db.limit.mockResolvedValueOnce([]);

    const service = new AuthService(
      db as unknown as DbClient,
      jwtMock as unknown as JwtService,
      configMock as unknown as ConfigService,
    );

    await expect(
      service.login(
        {
          email: 'missing@example.com',
          password: 'Password1',
          rememberMe: false,
        },
        { ipAddress: '127.0.0.1', userAgent: 'jest' },
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  test('throws UnauthorizedException when password is invalid', async () => {
    const db = createDbMock();

    // lookup: user exists
    db.limit.mockResolvedValueOnce([
      {
        id: 'user-1',
        email: 'paolo@example.com',
        passwordHash: 'HASHED',
      },
    ]);

    (bcrypt.compare as unknown as jest.Mock).mockResolvedValueOnce(false);

    const service = new AuthService(
      db as unknown as DbClient,
      jwtMock as unknown as JwtService,
      configMock as unknown as ConfigService,
    );

    await expect(
      service.login(
        {
          email: 'paolo@example.com',
          password: 'WrongPassword1',
          rememberMe: false,
        },
        { ipAddress: '127.0.0.1', userAgent: 'jest' },
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  test('returns accessToken + user and inserts access log on success', async () => {
    const db = createDbMock();

    const createdAt = new Date('2026-01-20T02:09:33.732Z');
    const updatedAt = new Date('2026-01-20T02:09:33.732Z');

    // lookup: user exists (must include fields used by toUserPublicDto)
    db.limit.mockResolvedValueOnce([
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

    (bcrypt.compare as unknown as jest.Mock).mockResolvedValueOnce(true);

    // rememberMe false -> short expiry
    configMock.get.mockImplementation((key: string) => {
      if (key === 'JWT_EXPIRES_IN') return '15m';
      if (key === 'JWT_REMEMBER_EXPIRES_IN') return '30d';
      return undefined;
    });

    jwtMock.signAsync.mockResolvedValueOnce('TOKEN');

    // access log insert: our db mock uses insert().values().returning()
    // we don't need returning for insert(accessLogs), but the chain exists.
    db.returning.mockResolvedValueOnce([]); // harmless

    const service = new AuthService(
      db as unknown as DbClient,
      jwtMock as unknown as JwtService,
      configMock as unknown as ConfigService,
    );

    const res = await service.login(
      {
        email: 'paolo@example.com',
        password: 'Password1',
        rememberMe: false,
      },
      { ipAddress: '127.0.0.1', userAgent: 'jest' },
    );

    // 1 final assert on output (your preferred style)
    expect(res).toEqual({
      accessToken: 'TOKEN',
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

    // minimal interaction checks (optional but useful)
    expect(jwtMock.signAsync).toHaveBeenCalled();
    expect(db.insert).toHaveBeenCalled(); // access log write happens
  });
});
