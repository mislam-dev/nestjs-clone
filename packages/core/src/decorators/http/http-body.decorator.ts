import { REQUEST_BODY_KEY } from "../keys.decorator";

export type RequestBodyType = {
  index: number;
};
export function Body() {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const body: RequestBodyType = {
      index: parameterIndex,
    };
    const params =
      Reflect.getMetadata(REQUEST_BODY_KEY, target, propertyKey) || [];
    params.push(body);
    Reflect.defineMetadata(REQUEST_BODY_KEY, params, target, propertyKey);
  };
}
