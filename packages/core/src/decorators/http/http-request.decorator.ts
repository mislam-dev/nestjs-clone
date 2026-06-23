import { REQUEST_KEY } from "../keys.decorator";

export function Req() {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const param: { index: number } = {
      index: parameterIndex,
    };
    const params = Reflect.getMetadata(REQUEST_KEY, target, propertyKey) || [];
    params.push(param);
    Reflect.defineMetadata(REQUEST_KEY, params, target, propertyKey);
  };
}
