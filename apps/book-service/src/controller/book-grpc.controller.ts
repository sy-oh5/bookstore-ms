import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BookGrpcService } from '../service/book-grpc.service';
import { BookCategory } from '../enum/book-category.enum';

@Controller()
export class BookGrpcController {
  constructor(private readonly bookGrpcService: BookGrpcService) {}

  @GrpcMethod('BookGrpcService', 'GetBookNames')
  async getBookNames(data: { bookIds: number[] }): Promise<{ books: any[] }> {
    return this.bookGrpcService.getBookNames(data);
  }

  @GrpcMethod('BookGrpcService', 'GetBooks')
  async getBook(data: {
    title: string;
    author: string;
    category: BookCategory;
  }): Promise<{ books: any[] }> {
    return this.bookGrpcService.getBooks(
      data.title,
      data.author,
      data.category,
    );
  }
}
