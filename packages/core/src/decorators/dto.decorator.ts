import { DTO_KEY } from "./keys.decorator";

export function UseDTO(schema: any) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(DTO_KEY, schema, target, propertyKey);
  };
}
