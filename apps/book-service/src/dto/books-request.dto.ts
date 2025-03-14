import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookCategory } from '../enum/book-category.enum';

export class BooksRequestDto {
  @ApiProperty({
    description: '책 제목',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: '책 저자',
    required: false,
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({
    description: '책 카테고리',
    required: false,
    enum: BookCategory,
  })
  @IsOptional()
  @IsEnum(BookCategory, {
    message: `category must be one of the following values: ${Object.values(BookCategory).join(', ')}`,
  })
  category?: BookCategory;
}
