import { Exception } from "./exception.exception";

export class UnauthorizedException extends Exception {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}
