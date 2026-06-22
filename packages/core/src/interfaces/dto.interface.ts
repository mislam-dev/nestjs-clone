import { instanceToPlain, plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import "reflect-metadata";
import z from "zod";

type SafeParseZodResult<T> =
  | {
      success: false;
      error: any;
    }
  | {
      success: true;
      data: T;
    };

export interface IZodSchema<T = any> {
  parse(data: any): T;
  safeParse(data: any): SafeParseZodResult<T>;
  asyncParse(data: any): Promise<T>;
  safeAsyncParse(data: any): Promise<SafeParseZodResult<T>>;
}

export class BaseZodSchema<T> implements IZodSchema<T> {
  constructor(protected readonly schema: z.ZodType<T>) {}

  asyncParse(data: any): Promise<T> {
    return this.schema.parseAsync(data);
  }

  safeAsyncParse(data: any): Promise<SafeParseZodResult<T>> {
    return this.schema.safeParseAsync(data);
  }

  parse(data: any): T {
    return this.schema.parse(data);
  }

  safeParse(data: any): SafeParseZodResult<T> {
    return this.schema.safeParse(data);
  }
}

export async function validateDto(
  data: Record<string, any>,
  instanceClass: any,
) {
  const instance: any = plainToInstance(instanceClass, data);
  const errors = await validate(instance, { whitelist: true });
  if (errors.length > 0) {
    const allErrors = toErrors(errors);
    // throw new BadRequestException(allErrors)
    throw allErrors;
  }
  const safeData = instanceToPlain(instance);
  return safeData;
}

function toErrors(errors: ValidationError[]) {
  return errors.map((err) => {
    const property = err.property;
    const constraints = Object.values(err.constraints || {});
    return { property, constraints };
  });
}
