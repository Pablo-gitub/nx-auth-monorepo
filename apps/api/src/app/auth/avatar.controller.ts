import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Request } from 'express';

import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { randomBytes } from 'crypto';

function extFromMime(mime: string): '.jpg' | '.png' | '.webp' {
  switch (mime) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    default:
      // Should never happen because fileFilter blocks other mimetypes
      return '.jpg';
  }
}

function randomName(bytes = 16): string {
  return randomBytes(bytes).toString('hex');
}


@Controller('me')
@UseGuards(JwtAuthGuard)
export class AvatarController {
  constructor(private readonly auth: AuthService) {}

  /**
   * Upload authenticated user's avatar.
   * Saves the file under /uploads/avatars and updates users.avatarUrl.
   */
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/avatars',
        filename: (_req, file, cb) => {
          const ext = extFromMime(file.originalname);
          cb(null, `${randomName()}${ext}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
      fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
          cb(new BadRequestException('Unsupported file type'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('Missing file');
    }

    // JwtAuthGuard should set req.user
    const userId = (req.user as { sub?: string } | undefined)?.sub;
    if (!userId) {
      throw new BadRequestException('Invalid token payload');
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;

    const user = await this.auth.updateAvatar(userId, avatarUrl);

    return { user };
  }
}
