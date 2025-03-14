import { ApiProperty } from '@nestjs/swagger';
import { BookCategory } from '../enum/book-category.enum';

export class BooksResponseDto {
  @ApiProperty({ description: '책 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '책 제목', example: 'NestJS in Action' })
  title: string;

  @ApiProperty({ description: '책 저자', example: 'John Doe' })
  author: string;

  @ApiProperty({
    description: '책 카테고리',
    enum: BookCategory,
    example: BookCategory.TECHNOLOGY,
  })
  category: BookCategory;

  @ApiProperty({ description: '대여 가능 여부', example: true })
  isAvailable: boolean;
}
