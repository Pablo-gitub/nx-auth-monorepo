// apps/api/src/app/database/database.module.ts
import { Module } from '@nestjs/common';
import { db } from '@assignment-ftechnology/db';

export const DB = Symbol('DB');

@Module({
  providers: [
    {
      provide: DB,
      useValue: db,
    },
  ],
  exports: [DB],
})
export class DatabaseModule {}
