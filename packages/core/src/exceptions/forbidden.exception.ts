import { HTTP_STATUS } from "../status-code";
import { Exception } from "./exception.exception";

export class ForbiddenException extends Exception {
  constructor(message: string = "Forbidden") {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}
