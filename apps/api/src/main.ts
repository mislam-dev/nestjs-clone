import { Factory } from "@nc/core/factory";
import "reflect-metadata";
import { AppModule } from "./app.module";
import "./v";
async function main() {
  const app = Factory.create(AppModule);
  const PORT = process.env.PORT || 3000;

  app.listen(Number(PORT));
}

void main();
