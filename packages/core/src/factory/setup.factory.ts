import { TModule } from "./module";

export interface IFactory {
  create(module: TModule): IFactory;
  listen(port: number): void;
  exceptionFilters(filters: any[]): void; // todo: add real interface for filters
  responseTransformers(pipes: any[]): void; // todo: add real interface for pipes
}

export class Factory implements IFactory {
  constructor() {}
  create(module: TModule): IFactory {
    throw new Error("Method not implemented.");
  }
  listen(port: number): void {
    console.log("application is running or port " + port);
  }
  exceptionFilters(filters: any[]): void {
    throw new Error("Method not implemented.");
  }
  responseTransformers(pipes: any[]): void {
    throw new Error("Method not implemented.");
  }
}
