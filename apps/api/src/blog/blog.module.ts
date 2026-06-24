import { Module } from "@nc/core/decorators";
import { injectable } from "tsyringe";
import { BlogController } from "./blog.controller";

@Module({
  imports: [],
  controllers: [BlogController],
  providers: [],
})
@injectable()
export class BlogModule {}
