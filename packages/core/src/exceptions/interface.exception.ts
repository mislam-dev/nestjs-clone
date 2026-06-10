export interface IException {
  getErrorMessage(): string;
  getStatusCode(): number;
  getRequestId(): string;
}

export interface IBadRequestException extends IException {
  getErrorData(): any[];
}
