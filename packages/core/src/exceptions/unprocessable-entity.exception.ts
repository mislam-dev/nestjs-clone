import { Exception } from "./exception.exception";

export class UnprocessableEntityException extends Exception {
  constructor(message: string = "Unprocessable Entity") {
    super(message, 422);
  }
}
