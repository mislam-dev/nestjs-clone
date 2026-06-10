import { Exception } from "./exception.exception";

export class NotFoundException extends Exception {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}
