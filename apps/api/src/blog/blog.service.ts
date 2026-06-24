import { NotFoundException } from "@nc/core";
import { randomUUID } from "crypto";
import { injectable } from "tsyringe";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
}

@injectable()
export class BlogService {
  private posts: BlogPost[] = [];

  findAll(): BlogPost[] {
    return this.posts;
  }

  findOne(id: string): BlogPost {
    const post = this.posts.find((p) => p.id === id);
    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }
    return post;
  }

  create(dto: CreatePostDto): BlogPost {
    const newPost: BlogPost = {
      id: randomUUID(),
      title: dto.title,
      content: dto.content,
      date: dto.date || new Date().toISOString(),
    };
    this.posts.push(newPost);
    return newPost;
  }

  update(id: string, dto: UpdatePostDto): BlogPost {
    const postIndex = this.posts.findIndex((p) => p.id === id);
    if (postIndex === -1) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    const currentPost = this.posts[postIndex]!;
    const updatedPost: BlogPost = {
      ...currentPost,
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.content !== undefined && { content: dto.content }),
      ...(dto.date !== undefined && { date: dto.date }),
    };

    this.posts[postIndex] = updatedPost;
    return updatedPost;
  }

  delete(id: string): { success: boolean; message: string } {
    const postIndex = this.posts.findIndex((p) => p.id === id);
    if (postIndex === -1) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }
    this.posts.splice(postIndex, 1);
    return {
      success: true,
      message: `Blog post with ID ${id} deleted successfully`,
    };
  }
}
