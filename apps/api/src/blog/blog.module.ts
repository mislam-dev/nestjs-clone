import { Module } from "@nc/core";
import { injectable } from "tsyringe";
import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";

@Module({
  imports: [],
  controllers: [BlogController],
  providers: [BlogService],
})
@injectable()
export class BlogModule {}
