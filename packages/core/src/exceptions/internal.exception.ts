import { HTTP_STATUS } from "../status-code";
import { Exception } from "./exception.exception";

export class InternalServerException extends Exception {
  constructor(message: string = "Internal Server Error") {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
