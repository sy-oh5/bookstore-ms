import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookAggregator } from '../aggregator/book.aggregator';
import { BooksResponseDto } from '../dto/books-response.dto';
import { BooksRequestDto } from '../dto/books-request.dto';

@ApiTags('Book') //  Swagger 태그 추가
@Controller('books')
export class BookController {
  constructor(private readonly bookAggregator: BookAggregator) {}

  @ApiOperation({
    summary: '책 검색',
    description: '제목, 저자, 카테고리로 책을 검색합니다.',
  })
  @ApiResponse({
    status: 200,
    type: [BooksResponseDto],
  })
  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getBooks(
    @Query() BooksRequestDto: BooksRequestDto,
  ): Promise<BooksResponseDto[]> {
    return this.bookAggregator.getBooks(
      BooksRequestDto.title,
      BooksRequestDto.author,
      BooksRequestDto.category,
    );
  }
}
