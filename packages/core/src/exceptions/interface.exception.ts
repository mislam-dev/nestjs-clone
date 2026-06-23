import { HTTP_STATUS } from "../status-code";

export interface IException {
  getErrorMessage(): string;
  getStatusCode(): (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
  getRequestId(): string;
}

export interface IBadRequestException extends IException {
  getErrorData(): any[];
}
