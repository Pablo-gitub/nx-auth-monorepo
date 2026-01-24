import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, type ZodTypeAny } from 'zod';

type ZodValidationError = {
  path: string;
  message: string;
};

function formatZodError(error: ZodError): ZodValidationError[] {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}

/**
 * Validates request payloads with Zod and surfaces readable errors.
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodTypeAny) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: formatZodError(result.error),
      });
    }

    return result.data;
  }
}
