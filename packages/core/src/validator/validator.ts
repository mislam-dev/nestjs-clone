import { injectable } from "tsyringe";
import z from "zod";
import {
  IValidator,
  SchemaOrClass,
  ValidateResult,
} from "../interfaces/dto.interface";
import { ClassValidator } from "./class-validator";
import { ZodValidator } from "./zod-validator";

@injectable()
export class Validator implements IValidator {
  constructor(
    private readonly zodValidator: ZodValidator,
    private readonly classValidator: ClassValidator,
  ) {}
  async validate<T>(
    schema: SchemaOrClass,
    data: Record<string, string>,
  ): Promise<ValidateResult<T>> {
    let v: IValidator | null = null;
    if (schema instanceof z.ZodType) {
      v = this.zodValidator;
    }
    if (schema.prototype && schema.prototype.constructor) {
      v = this.classValidator;
    }

    if (!v)
      throw new Error(
        "[Validator]: invalid schema or class provided, please provide a valid zod schema or a class",
      );
    return v.validate(schema, data);
  }
}
