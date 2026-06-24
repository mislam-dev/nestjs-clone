import z from "zod";
import {
  IValidator,
  SchemaOrClass,
  ValidateResult,
} from "../interfaces/dto.interface";

export type SafeParseZodResult<T> =
  | {
      success: false;
      error: any;
    }
  | {
      success: true;
      data: T;
    };

export interface IZodValidator<T = any> {
  parse(data: any): T;
  safeParse(data: any): SafeParseZodResult<T>;
  asyncParse(data: any): Promise<T>;
  safeAsyncParse(data: any): Promise<SafeParseZodResult<T>>;
}

export class ZodValidator<T = any> implements IZodValidator<T>, IValidator {
  private _schema: z.ZodType<T> | null = null;

  get schema() {
    if (!this._schema)
      throw new Error("[ZodValidator]: schema not initialized");
    return this._schema;
  }
  create(schema: z.ZodType<T>) {
    this._schema = schema;
    return this;
  }
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

  async validate(
    schema: SchemaOrClass,
    data: Record<string, string>,
  ): Promise<ValidateResult<T>> {
    const zod = this.create(schema as z.ZodType<T>);
    const result = await zod.safeAsyncParse(data);
    if (result.success) {
      return result.data as T;
    }
    return result.error;
  }
}
