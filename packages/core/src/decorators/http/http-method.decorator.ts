// http method -> get, post , patch, put, delete
// Routes
// path name
// middlewares
// method name -> controller method
// http method

import { RequestHandler } from "express";
import { ROUTE_KEY } from "../keys.decorator";

export type HTTPMethod = "get" | "post" | "patch" | "put" | "delete";

export type RouteDefinition = {
  path: string;
  middlewares: RequestHandler[];
  methodName: string; // controller
  httpMethod: HTTPMethod;
};

function Route(
  method: HTTPMethod,
  path: string,
  middlewares: RequestHandler[],
) {
  return function (target: any, propertyKey: string) {
    const routes: RouteDefinition[] =
      Reflect.getMetadata(ROUTE_KEY, target) || [];
    routes.push({
      path,
      middlewares,
      methodName: propertyKey,
      httpMethod: method,
    });

    Reflect.defineMetadata(ROUTE_KEY, routes, target);
  };
}

export const Get = (path: string = "", middlewares: RequestHandler[] = []) => {
  return Route("get", path, middlewares);
};

export const Post = (path: string = "", middlewares: RequestHandler[] = []) => {
  return Route("post", path, middlewares);
};

export const Patch = (
  path: string = "",
  middlewares: RequestHandler[] = [],
) => {
  return Route("patch", path, middlewares);
};

export const Put = (path: string = "", middlewares: RequestHandler[] = []) => {
  return Route("put", path, middlewares);
};

export const Delete = (
  path: string = "",
  middlewares: RequestHandler[] = [],
) => {
  return Route("delete", path, middlewares);
};
