import { HTTP_STATUS } from "../status-code";
import { Exception } from "./exception.exception";

export class NotFoundException extends Exception {
  constructor(message: string = "Resource not found") {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}
