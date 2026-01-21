import { BadRequestException } from '@nestjs/common';
import type { Request } from 'express';

import { AvatarController } from './avatar.controller';
import type { AuthService } from './auth.service';

type AuthServiceMock = Pick<AuthService, 'updateAvatar'>;

describe('AvatarController', () => {
  test('throws BadRequestException when file is missing', async () => {
    const authMock: AuthServiceMock = {
      updateAvatar: jest.fn(),
    };

    const controller = new AvatarController(authMock as unknown as AuthService);

    const req = { user: { sub: 'user-1' } } as unknown as Request;

    await expect(controller.uploadAvatar(undefined, req)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  test('returns updated user and calls updateAvatar with computed avatarUrl', async () => {
    const authMock: AuthServiceMock = {
      updateAvatar: jest.fn().mockResolvedValue({
        id: 'user-1',
        firstName: 'Paolo',
        lastName: 'Pietrelli',
        email: 'paolo@example.com',
        birthDate: '1997-01-01',
        avatarUrl: '/uploads/avatars/file.png',
        createdAt: '2026-01-20T02:09:33.732Z',
        updatedAt: '2026-01-20T02:09:33.732Z',
      }),
    };

    const controller = new AvatarController(authMock as unknown as AuthService);

    const req = { user: { sub: 'user-1' } } as unknown as Request;

    const file = { filename: 'file.png' } as unknown as Express.Multer.File;

    const res = await controller.uploadAvatar(file, req);

    expect(res.user.avatarUrl).toBe('/uploads/avatars/file.png');
    expect(authMock.updateAvatar).toHaveBeenCalledWith(
      'user-1',
      '/uploads/avatars/file.png',
    );
  });
});
