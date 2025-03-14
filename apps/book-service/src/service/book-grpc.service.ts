import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Book } from '../entity/book.entity';
import { GrpcMethod } from '@nestjs/microservices';
import { BookCategory } from '../enum/book-category.enum';

@Injectable()
export class BookGrpcService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async onModuleInit() {
    await this.insertDefaultBooks(); //  서비스 실행 시 기본 데이터 삽입
  }

  private async insertDefaultBooks() {
    const existingBooks = await this.bookRepository.count();
    if (existingBooks > 0) return; // 이미 유저가 있으면 추가 안 함

    const defaultBooks = [
      {
        title: 'NestJS in Action',
        author: 'John Doe',
        category: BookCategory.TECHNOLOGY,
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        category: BookCategory.TECHNOLOGY,
      },
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        category: BookCategory.SCIENCE,
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        category: BookCategory.HISTORY,
      },
      {
        title: 'The Lean Startup',
        author: 'Eric Ries',
        category: BookCategory.BUSINESS,
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        category: BookCategory.SELF_HELP,
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        category: BookCategory.FICTION,
      },
    ];

    await this.bookRepository.save(defaultBooks); //  기본 데이터 삽입
    console.log('기본 책 insert');
  }

  @GrpcMethod()
  async getBooks(
    title?: string,
    author?: string,
    category?: BookCategory,
  ): Promise<{ books: any[] }> {
    const query = this.bookRepository.createQueryBuilder('book');

    if (title) {
      query.andWhere('book.title LIKE :title', { title: `%${title}%` });
    }
    if (author) {
      query.andWhere('book.author LIKE :author', { author: `%${author}%` });
    }
    if (category) {
      query.andWhere('book.category = :category', { category });
    }

    const result = await query.getMany();

    return {
      books: result.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
      })),
    };
  }

  async getBookNames(data: { bookIds: number[] }): Promise<{ books: any[] }> {
    const books = await this.bookRepository.find({
      where: { id: In(data.bookIds) },
    });

    return {
      books: books.map((book) => ({
        bookId: book.id,
        bookName: book.title,
      })),
    };
  }
}
