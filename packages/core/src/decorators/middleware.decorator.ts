import { RequestHandler } from "express";
import { CONTROLLER_MIDDLEWARE_KEY, MIDDLEWARE_KEY } from "./keys.decorator";

export function Use(middleware: RequestHandler | RequestHandler[]) {
  return function (target: any, propertyKey?: string | symbol) {
    const middlewares: RequestHandler[] = Array.isArray(middleware)
      ? middleware
      : [middleware];

    if (propertyKey && typeof propertyKey === "string") {
      const existingMiddleware =
        Reflect.getMetadata(MIDDLEWARE_KEY, target, propertyKey) || [];
      const combinedMiddleware = [...middlewares, ...existingMiddleware];
      Reflect.defineMetadata(
        MIDDLEWARE_KEY,
        combinedMiddleware,
        target,
        propertyKey,
      );
      return;
    }

    const existingMiddleware =
      Reflect.getMetadata(CONTROLLER_MIDDLEWARE_KEY, target) || [];
    const combinedMiddleware = [...middlewares, ...existingMiddleware];

    Reflect.defineMetadata(
      CONTROLLER_MIDDLEWARE_KEY,
      combinedMiddleware,
      target,
    );
  };
}
