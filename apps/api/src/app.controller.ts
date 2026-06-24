import { Controller, Get } from "@nc/core";
import { injectable } from "tsyringe";

@Controller("")
@injectable()
export class AppController {
  @Get()
  home() {
    return { message: "root" };
  }

  @Get("health")
  health() {
    return { message: "Server is up and running!" };
  }
}
