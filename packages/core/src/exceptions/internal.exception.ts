import { Exception } from "./exception.exception";

export class InternalServerException extends Exception {
  constructor(message: string = "Internal Server Error") {
    super(message, 500);
  }
}
