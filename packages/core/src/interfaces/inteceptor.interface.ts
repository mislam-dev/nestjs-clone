import { NextFunction, Request, Response } from "express";

export interface IInterceptor {
  preIntercept?: (req: Request, res: Response, next: NextFunction) => void;
  postIntercept?: (req: Request, res: Response, next: NextFunction) => void;
  intercept(req: Request, res: Response, next: NextFunction): void;
}
