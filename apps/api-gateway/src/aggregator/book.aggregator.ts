import { Injectable } from '@nestjs/common';
import { BookService } from '../service/book.service';
import { RentalService } from '../service/rental.service';
import { BookCategory } from '../enum/book-category.enum';
import { BooksResponseDto } from '../dto/books-response.dto';

@Injectable()
export class BookAggregator {
  constructor(
    private readonly bookService: BookService,
    private readonly rentalService: RentalService,
  ) {}

  async getBooks(
    title?: string,
    author?: string,
    category?: BookCategory,
  ): Promise<BooksResponseDto[]> {
    // 1. Book Service에서 책 정보 조회
    const bookResponse = await this.bookService.getBooks(
      title,
      author,
      category,
    );
    // Book Service에서 반환한 형식: { books: { id: number; title: string; author: string; category: BookCategory }[] }
    const books = bookResponse.books;
    if (!books || books.length === 0) return [];

    // 2. 조회된 책의 ID 배열 생성
    const bookIds = books.map((book) => book.id);

    // 3. Rental Service에서 각 책의 대여 가능 여부 조회
    const rentalResponse = await this.rentalService.getBookIsAvailable(bookIds);
    // rentalResponse 형식: { books: { bookId: number; isAvailable: boolean }[] }
    // 4. Rental 응답을 Map으로 변환 (bookId → isAvailable)
    const availabilityMap = new Map<number, boolean>(
      rentalResponse.books.map((item) => [item.bookId, item.isAvailable]),
    );

    // 5. 두 결과를 결합하여 최종 BooksResponseDto 배열 생성
    const aggregatedBooks: BooksResponseDto[] = books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      isAvailable: availabilityMap.get(book.id)!,
    }));

    return aggregatedBooks;
  }
}
