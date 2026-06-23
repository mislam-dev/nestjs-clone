import { HTTP_STATUS } from "../status-code";
import { Exception } from "./exception.exception";

export class NotImplementedException extends Exception {
  constructor(message: string = "Not Implemented") {
    super(message, HTTP_STATUS.NOT_IMPLEMENTED);
  }
}
