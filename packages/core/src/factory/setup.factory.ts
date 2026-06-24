import { randomUUID } from "crypto";
import express, {
  Application,
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import expressListEndpoints from "express-list-endpoints";
import http from "http";
import { container } from "tsyringe";
import { HTTPMethod, ParamType, RouteDefinition } from "../decorators/http";
import {
  CONTROLLER_KEY,
  CONTROLLER_MIDDLEWARE_KEY,
  DTO_KEY,
  MIDDLEWARE_KEY,
  MODULE_KEY,
  REQUEST_BODY_KEY,
  REQUEST_KEY,
  RESPONSE_KEY,
  ROUTE_KEY,
  STATUS_CODE_KEY,
  URL_PARAMS_KEY,
  URL_QUERY_KEY,
} from "../decorators/keys.decorator";
import { BadRequestException, Exception } from "../exceptions";
import { HTTP_STATUS } from "../status-code";
import { Validator } from "../validator";
import { TModule } from "./module";

export interface IFactory {
  build(module: TModule): IFactory;
  listen(port: number, callback?: () => void): void;
  exceptionFilters(filters: any[]): void; // todo: add real interface for filters
  responseTransformers(pipes: any[]): void; // todo: add real interface for pipes
}

export class Factory implements IFactory {
  private _app: Application | null = null;

  constructor() {
    this._app = express();
  }

  static create(module: any) {
    const factory = new Factory();
    return factory.build(module);
  }

  private get app() {
    if (!this._app) {
      throw new Error("[Factory]: Application is not created");
    }
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));
    return this._app;
  }

  build(module: any): IFactory {
    const mod: TModule = Reflect.getMetadata(MODULE_KEY, module);
    if (!mod) {
      throw new Error(
        `[Factory]: Module ${module.name || module} is not registered (missing @Module decorator)`,
      );
    }

    const { controllers, imports } = mod;

    this.registerControllers(controllers ?? []);
    this.nestedModuleControllers(imports ?? []);

    this.handleGlobalErrors();
    this.handleNotFound();

    return this;
  }

  private handleGlobalErrors() {
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof BadRequestException) {
          return res.status(err.getStatusCode()).json({
            message: err.getErrorMessage(),
            request_id: err.getRequestId(),
            errors: err.getErrorData() || [],
          });
        }

        if (err instanceof Exception) {
          return res.status(err.getStatusCode()).json({
            message: err.getErrorMessage(),
            request_id: err.getRequestId(),
          });
        }
        return res.status(500).json({
          message: "internal server error",
        });
      },
    );
  }

  private handleNotFound() {
    this.app.use("*", (_req, res) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Not Found",
        request_id: randomUUID(),
      });
    });
  }

  private nestedModuleControllers(modules: TModule[]) {
    if (modules.length === 0) return;

    modules.forEach((mod) => {
      const moduleProperties: TModule = Reflect.getMetadata(MODULE_KEY, mod);
      if (moduleProperties?.controllers) {
        this.registerControllers(moduleProperties.controllers);
      }
      this.nestedModuleControllers(moduleProperties.imports ?? []);
    });
  }

  private getControllerMetaData(controller: any): {
    basePath: string;
    routes: RouteDefinition[];
    middlewares: RequestHandler[];
  } {
    const controllerInstance: any = container.resolve(controller)!;
    const metaData: {
      basePath: string;
      routes: RouteDefinition[];
      middlewares: RequestHandler[];
    } = {
      basePath: Reflect.getMetadata(CONTROLLER_KEY, controller),
      routes: Reflect.getMetadata(ROUTE_KEY, controllerInstance!) || [],
      middlewares:
        Reflect.getMetadata(CONTROLLER_MIDDLEWARE_KEY, controller) || [],
    };

    if (typeof metaData.basePath !== "string") {
      throw new Error(
        `[Factory]: Controller ${controller.name} is not registered`,
      );
    }
    if (metaData.routes.length <= 0) {
      throw new Error(`[Factory]: Controller ${controller.name} has no routes`);
    }
    return metaData;
  }

  private buildRouteArgs(
    req: Request,
    res: Response,
    controllerInstance: any,
    methodName: string,
  ): any[] {
    const paramNames: ParamType[] =
      Reflect.getMetadata(URL_PARAMS_KEY, controllerInstance, methodName) || [];
    const queryNames: ParamType[] =
      Reflect.getMetadata(URL_QUERY_KEY, controllerInstance, methodName) || [];

    const requestNames: { index: number }[] =
      Reflect.getMetadata(REQUEST_KEY, controllerInstance, methodName) || [];
    const responseNames: { index: number }[] =
      Reflect.getMetadata(RESPONSE_KEY, controllerInstance, methodName) || [];
    const requestBody: { index: number }[] =
      Reflect.getMetadata(REQUEST_BODY_KEY, controllerInstance, methodName) ||
      [];
    const args: any[] = [];
    paramNames.forEach((p) => {
      args[p.index] = req.params[p.key];
    });

    queryNames.forEach(({ index }) => {
      args[index] = req.query;
    });

    requestNames.forEach(({ index }) => {
      args[index] = req;
    });

    responseNames.forEach(({ index }) => {
      args[index] = res;
    });
    requestBody.forEach(({ index }) => {
      args[index] = req.body;
    });
    return args;
  }

  private async validateDto(
    controllerInstance: any,
    methodName: string,
    body: any,
  ): Promise<any> {
    const dtoSchemaOrClass = Reflect.getMetadata(
      DTO_KEY,
      controllerInstance,
      methodName,
    );

    if (!dtoSchemaOrClass) return null;

    const validator = Validator.create();

    const result = await validator.validate(dtoSchemaOrClass, body);

    if (Array.isArray(result)) {
      throw new BadRequestException("Validation Error", result);
    }
    return result;
  }

  private routeHandler(
    controllerInstance: any,
    route: RouteDefinition,
  ): RequestHandler {
    const statusCode: number = Reflect.getMetadata(
      STATUS_CODE_KEY,
      controllerInstance,
      route.methodName,
    );

    const handler = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validatedDto = await this.validateDto(
          controllerInstance,
          route.methodName,
          req.body,
        );
        if (validatedDto) req.body = validatedDto;

        const args: any[] = this.buildRouteArgs(
          req,
          res,
          controllerInstance,
          route.methodName,
        );

        const data = await controllerInstance[route.methodName](...args);
        res
          .status(statusCode ?? this.getDefaultStatus(route.httpMethod))
          .json(data);
      } catch (error) {
        next(error);
      }
    };

    return handler;
  }

  private registerControllers(controllers: any[]): void {
    controllers.forEach((controller) => {
      const metaData = this.getControllerMetaData(controller);

      const router = Router();

      this.registerMiddlewares(router, metaData.middlewares);

      const controllerInstance: any = container.resolve(controller)!;

      metaData.routes.forEach((route) => {
        if (!(route.methodName in controllerInstance)) {
          throw new Error(
            `[Factory]: ${route.methodName} not found in ${controller.name}`,
          );
        }

        const middlewares: RequestHandler[] =
          Reflect.getMetadata(
            MIDDLEWARE_KEY,
            controllerInstance,
            route.methodName,
          ) || [];

        const handler = this.routeHandler(controllerInstance, route);

        router[route.httpMethod](
          route.path.startsWith("/") ? route.path : `/${route.path}`,
          ...(middlewares ?? []),
          handler,
        );
      });
      const controllerPath = `/${metaData.basePath}`;

      this.app.use(controllerPath, router);
    });
  }

  private logRoutes(app: any) {
    console.table(expressListEndpoints(app));
  }

  private getDefaultStatus(methodName: HTTPMethod): number {
    const store = {
      get: HTTP_STATUS.OK,
      post: HTTP_STATUS.CREATED,
      patch: HTTP_STATUS.OK,
      put: HTTP_STATUS.OK,
      delete: HTTP_STATUS.NO_CONTENT,
    };

    return store[methodName];
  }

  private registerMiddlewares(
    router: Router,
    middlewares: RequestHandler[],
  ): void {
    middlewares.forEach((mid) => {
      router.use(mid);
    });
  }

  private registerProviders(): void {}

  listen(port: number = 3000, callback?: () => void): void {
    const server = http.createServer(this.app);

    server.on("error", (error: any) => {
      if (error.code === "EADDRINUSE") {
        console.error(`[Factory]: Port ${port} is already in use.`);
        process.exit(1);
      } else {
        console.error("[Factory]: Server error:", error);
      }
    });

    server.listen(port, () => {
      if (callback) {
        callback();
      } else {
        console.log(`Application is running on port ${port}`);
      }
    });

    const shutdown = (signal: string) => {
      server.close(() => {
        if (signal === "SIGUSR2") {
          process.kill(process.pid, "SIGUSR2");
        } else {
          process.exit(0);
        }
      });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
    process.once("SIGUSR2", () => shutdown("SIGUSR2"));
  }
  exceptionFilters(filters: any[]): void {
    throw new Error("Method not implemented.");
  }
  responseTransformers(pipes: any[]): void {
    throw new Error("Method not implemented.");
  }
}
