import { Exception } from "./exception.exception";

export class NotImplementedException extends Exception {
  constructor(message: string = "Not Implemented") {
    super(message, 501);
  }
}
