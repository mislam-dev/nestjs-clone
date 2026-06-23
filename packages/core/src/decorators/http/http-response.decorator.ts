import { RESPONSE_KEY } from "../keys.decorator";

export function Res() {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const param: { index: number } = {
      index: parameterIndex,
    };
    const params = Reflect.getMetadata(RESPONSE_KEY, target, propertyKey) || [];
    params.push(param);
    Reflect.defineMetadata(RESPONSE_KEY, params, target, propertyKey);
  };
}
