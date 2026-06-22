import { NextFunction, Request, Response } from "express";
import { IException } from "../exceptions";

export interface IExceptionFilter {
  catch(
    exception: IException,
    request: Request,
    response: Response,
    next: NextFunction,
  ): void | Promise<void>;
}
