import "reflect-metadata";

import { instanceToPlain, plainToInstance } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  Length,
  validate,
  ValidationError,
} from "class-validator";

export class Post {
  @IsNotEmpty()
  @Length(5, 20)
  title?: string;

  @IsNotEmpty()
  text?: string;

  @IsNotEmpty()
  rating?: number;

  @IsEmail()
  email?: string;
}

async function validation(data: Record<string, any>, instanceClass: any) {
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

(async () => {
  const requestData = {
    title: "hello",
    text: "hello",
    rating: 12,
    email: "test@test.com",
  };

  try {
    const validateData = await validation(requestData, Post);
    console.log({ validateData });
  } catch (error) {
    console.log(error);
  }
})();
