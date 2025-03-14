import { Injectable } from '@nestjs/common';
import { lastValueFrom, Observable } from 'rxjs';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { BookCategory } from '../enum/book-category.enum';

interface BookGrpcService {
  getBookNames(data: {
    bookIds: number[];
  }): Observable<{ books: { bookId: number; bookName: string }[] }>;
  getBooks(data: {
    title?: string;
    author?: string;
    category?: BookCategory;
  }): Observable<{
    books: {
      id: number;
      title: string;
      author: string;
      category: BookCategory;
    }[];
  }>;
}

@Injectable()
export class BookService {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'book',
      protoPath: 'proto/book.proto',
      url: process.env.BOOK_GRPC_URL,
    },
  })
  private client: ClientGrpc;
  private bookGrpcService: BookGrpcService;

  onModuleInit() {
    this.bookGrpcService =
      this.client.getService<BookGrpcService>('BookGrpcService');
  }

  // getBookNames 메서드를 호출하는 예시
  async getBookNames(
    bookIds: number[],
  ): Promise<{ books: { bookId: number; bookName: string }[] }> {
    const response = await lastValueFrom(
      this.bookGrpcService.getBookNames({ bookIds }),
    );
    return response;
  }

  async getBooks(
    title?: string,
    author?: string,
    category?: BookCategory,
  ): Promise<{
    books: {
      id: number;
      title: string;
      author: string;
      category: BookCategory;
    }[];
  }> {
    const response = await lastValueFrom(
      this.bookGrpcService.getBooks({ title, author, category }),
    );
    return response;
  }
}
