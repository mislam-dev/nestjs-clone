import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseDTO,
} from "@nc/core";
import { inject, injectable } from "tsyringe";
import { BlogService } from "./blog.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Controller("blog")
@injectable()
export class BlogController {
  constructor(@inject(BlogService) private readonly blogService: BlogService) {}

  @Get("posts")
  getAll() {
    return this.blogService.findAll();
  }

  @Get("posts/:id")
  getOne(@Param("id") id: string) {
    return this.blogService.findOne(id);
  }

  @Post("posts")
  @UseDTO(CreatePostDto)
  create(@Body() body: CreatePostDto) {
    console.log(body);
    return this.blogService.create(body);
  }

  @Patch("posts/:id")
  @UseDTO(UpdatePostDto)
  update(@Param("id") id: string, @Body() body: UpdatePostDto) {
    return this.blogService.update(id, body);
  }

  @Delete("posts/:id")
  delete(@Param("id") id: string) {
    return this.blogService.delete(id);
  }
}
