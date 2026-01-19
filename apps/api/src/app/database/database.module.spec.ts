import { Test } from '@nestjs/testing';
import { DatabaseModule, DB } from './database.module';

describe('DatabaseModule', () => {
  it('should provide DB token', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    const db = moduleRef.get(DB);
    expect(db).toBeDefined();
  });
});
