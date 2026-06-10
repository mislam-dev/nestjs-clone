import { randomUUID } from "crypto";
import { IException } from "./interface.exception";

export class Exception implements IException {
  private status_code: number;
  private message: string;
  private request_id: string;

  constructor(message: string, status_code: number) {
    this.status_code = status_code;
    this.message = message;
    this.request_id = randomUUID();
  }
  getErrorMessage(): string {
    return this.message;
  }
  getStatusCode(): number {
    return this.status_code;
  }

  getRequestId(): string {
    return this.request_id;
  }
}
