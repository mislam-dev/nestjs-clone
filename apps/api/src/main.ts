import { Factory } from "@nc/core";
import "reflect-metadata";
import { AppModule } from "./app.module";

async function main() {
  const app = Factory.create(AppModule);
  const PORT = process.env.PORT || 3000;

  app.listen(Number(PORT));
}

void main();
