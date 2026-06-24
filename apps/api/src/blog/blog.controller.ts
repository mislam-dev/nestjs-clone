import { Controller, Get, Post } from "@nc/core/decorators";
import { injectable } from "tsyringe";

@Controller("blog")
@injectable()
export class BlogController {
  @Get()
  all() {
    return { message: "blog root", data: [20, 30, 40, 50] };
  }

  @Get("posts")
  posts() {
    return { message: "blog posts", data: [20, 30, 40, 50] };
  }
  @Post("")
  createPost() {
    return { message: "blog posts", data: [20, 30, 40, 50] };
  }
}
