import { URL_PARAMS_KEY } from "../keys.decorator";

export type ParamType = {
  key: string;
  index: number;
};

export function Param(key: string) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const param: ParamType = {
      key,
      index: parameterIndex,
    };
    const params =
      Reflect.getMetadata(URL_PARAMS_KEY, target, propertyKey) || [];
    params.push(param);
    Reflect.defineMetadata(URL_PARAMS_KEY, params, target, propertyKey);
  };
}
