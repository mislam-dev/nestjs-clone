import { instanceToPlain, plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { IValidator, SingleError } from "../interfaces/dto.interface";

type ResultType = Promise<Record<string, any> | SingleError[]>;

export class ClassValidator implements IValidator {
  async validate(instanceClass: any, data: Record<string, any>): ResultType {
    const instance: any = plainToInstance(instanceClass, data);
    const errors = await validate(instance, { whitelist: true });
    if (errors.length > 0) {
      return this.toErrors(errors);
    }
    const safeData = instanceToPlain(instance);
    return safeData;
  }
  private toErrors(errors: ValidationError[]): SingleError[] {
    return errors.map((err) => {
      const property = err.property;
      const constraints = Object.values(err.constraints || {});
      return { property, constraints };
    });
  }
}
