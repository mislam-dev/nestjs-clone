import type { NextFunction, Request, Response } from "express";

export interface IMiddleware {
  use(req: Request, res: Response, next: NextFunction): void | Promise<void>;
}
