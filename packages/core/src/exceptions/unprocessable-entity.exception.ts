import { HTTP_STATUS } from "../status-code";
import { Exception } from "./exception.exception";

export class UnprocessableEntityException extends Exception {
  constructor(message: string = "Unprocessable Entity") {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
  }
}
