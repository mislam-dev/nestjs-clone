import { URL_QUERY_KEY } from "../keys.decorator";

export function Query() {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const param: { index: number } = {
      index: parameterIndex,
    };
    const params =
      Reflect.getMetadata(URL_QUERY_KEY, target, propertyKey) || [];
    params.push(param);
    Reflect.defineMetadata(URL_QUERY_KEY, params, target, propertyKey);
  };
}
