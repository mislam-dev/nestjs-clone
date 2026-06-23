import { HTTP_STATUS, type StatusCode } from "../../status-code";
import { STATUS_CODE_KEY } from "../keys.decorator";

export function StatusCode(statusCode: StatusCode = HTTP_STATUS.OK) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(STATUS_CODE_KEY, statusCode, target, propertyKey);
  };
}
