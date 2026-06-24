import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdatePostDto {
  @IsOptional()
  @IsString({ message: "Title must be a string" })
  title?: string;

  @IsOptional()
  @IsString({ message: "Content must be a string" })
  content?: string;

  @IsOptional()
  @IsDateString({}, { message: "Date must be a valid ISO date string" })
  date?: string;
}
