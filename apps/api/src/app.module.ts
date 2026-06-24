import { Module } from "@nc/core/decorators";
import { injectable } from "tsyringe";
import { AppController } from "./app.controller";
import { BlogModule } from "./blog/blog.module";

@Module({
  imports: [BlogModule],
  controllers: [AppController],
  providers: [],
})
@injectable()
export class AppModule {}
