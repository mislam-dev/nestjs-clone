import { randomUUID } from "crypto";
import { HTTP_STATUS } from "../status-code";
import { IException } from "./interface.exception";

export class Exception implements IException {
  private status_code: (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
  private message: string;
  private request_id: string;

  constructor(
    message: string,
    status_code: (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS],
  ) {
    this.status_code = status_code;
    this.message = message;
    this.request_id = randomUUID();
  }
  getErrorMessage(): string {
    return this.message;
  }
  getStatusCode(): (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS] {
    return this.status_code;
  }

  getRequestId(): string {
    return this.request_id;
  }
}
