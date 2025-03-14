import { Injectable } from '@nestjs/common';
import { RentalService } from '../service/rental.service';
import { UserService } from '../service/user.service';
import { BookService } from '../service/book.service';
import { RentalResponseDto } from '../dto/rental-response.dto';
import { CreateRentalsRequestDto } from '../dto/create-rentals-request';
import { UpdateRentalsRequestDto } from '../dto/update-rentals-request';

@Injectable()
export class RentalAggregator {
  constructor(
    private readonly rentalService: RentalService,
    private readonly userService: UserService,
    private readonly bookService: BookService,
  ) {}

  async getRentals(): Promise<RentalResponseDto[]> {
    // 1. rental 자료 조회
    const rentalResponse = await this.rentalService.getRentals();
    const rentals = rentalResponse.rentals;

    // 2. rentals에서 중복된 bookId, userId 추출
    const uniqueBookIds = Array.from(
      new Set(rentals.map((rental) => rental.bookId)),
    );
    const uniqueUserIds = Array.from(
      new Set(rentals.map((rental) => rental.userId)),
    );
    // 3. 필터링하여 책 정보 조회 (bookIds 전달)
    const booksResponse = await this.bookService.getBookNames(uniqueBookIds);
    // 4. 필터링하여 사용자 정보 조회 (userIds 전달)
    const usersResponse = await this.userService.getUsers(uniqueUserIds);
    // 5. 책과 사용자 매핑 생성
    const bookMap = new Map<number, string>();
    booksResponse.books.forEach((book) => {
      bookMap.set(book.bookId, book.bookName);
    });

    const userMap = new Map<number, string>();
    usersResponse.users.forEach((user) => {
      userMap.set(user.id, user.name);
    });

    // 6. 각 rental 항목에 사용자 이름과 책 이름 추가하여 RentalResponseDto 배열로 변환
    const combinedRentals: RentalResponseDto[] = rentals.map((rental) => ({
      id: rental.id,
      bookId: rental.bookId,
      userId: rental.userId,
      rentalDate: rental.rentalDate,
      dueDate: rental.dueDate,
      returnDate: rental.returnDate,
      userName: userMap.get(rental.userId) || '',
      bookName: bookMap.get(rental.bookId) || '',
    }));

    return combinedRentals;
  }

  async createRentals(
    createRentalsRequestDto: CreateRentalsRequestDto,
  ): Promise<{ result: boolean }> {
    return await this.rentalService.createRentals(createRentalsRequestDto);
  }

  async updateRentals(
    updateRentalsRequestDto: UpdateRentalsRequestDto,
  ): Promise<{ result: boolean }> {
    return await this.rentalService.updateRentals(updateRentalsRequestDto);
  }
}
