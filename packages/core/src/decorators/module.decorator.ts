import { TModule } from "../factory";
import { MODULE_KEY } from "./keys.decorator";

export function Module(properties: TModule) {
  return function (target: any) {
    Reflect.defineMetadata(MODULE_KEY, properties, target);
  };
}
