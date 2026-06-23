import { HTTP_STATUS } from "../status-code";
import { Exception } from "./exception.exception";

export class UnauthorizedException extends Exception {
  constructor(message: string = "Unauthorized") {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}
