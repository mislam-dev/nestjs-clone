import "reflect-metadata";
import z from "zod";

export type SingleError = {
  property: string;
  constraints: string[];
};

export type BodyData = Record<string, string>;
export type SchemaOrClass = z.ZodType<BodyData> | any;
export type ValidateResult<T> = T | SingleError[];

export interface IValidator<T = any> {
  validate(
    schema: SchemaOrClass,
    data: BodyData,
  ): ValidateResult<T> | Promise<ValidateResult<T>>;
}
