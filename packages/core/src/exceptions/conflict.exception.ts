import { Exception } from "./exception.exception";

export class ConflictException extends Exception {
  constructor(message: string = "Resource is already exist") {
    super(message, 409);
  }
}
