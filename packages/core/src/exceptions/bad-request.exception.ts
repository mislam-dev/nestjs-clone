import { Exception } from "./exception.exception";
import { IBadRequestException } from "./interface.exception";

export class BadRequestException
  extends Exception
  implements IBadRequestException
{
  private errors: any[];

  constructor(message: string = "Bad Request", errors: any[] = []) {
    super(message, 400);
    this.errors = errors;
  }

  getErrorData(): any[] {
    return this.errors;
  }
}
