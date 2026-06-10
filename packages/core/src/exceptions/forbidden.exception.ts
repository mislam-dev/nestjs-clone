import { Exception } from "./exception.exception";

export class ForbiddenException extends Exception {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}
