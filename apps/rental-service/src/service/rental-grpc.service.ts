import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { Rental } from '../entity/rental.entity';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateRentalsRequestDto } from '../dto/create-rentals-request';
import { UpdateRentalsRequestDto } from '../dto/update-rentals-request';
import { toTimestamp } from '../date.utils';

@Injectable()
export class RentalGrpcService implements OnModuleInit {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,
  ) {}

  async onModuleInit() {
    await this.insertDefaultRental();
  }

  // 앱 실행 시 기본 rental 레코드 삽입 (userId: 1, bookId: 1)
  private async insertDefaultRental(): Promise<void> {
    const rentalCount = await this.rentalRepository.count();
    if (rentalCount === 0) {
      const defaultDto1: CreateRentalsRequestDto = {
        userId: 1,
        bookIds: [1, 2],
      };
      await this.createRentals(defaultDto1);

      const defaultDto2: UpdateRentalsRequestDto = { bookIds: [1] };
      await this.updateRentals(defaultDto2);
      console.log('기본 대여 데이터 생성');
    }
  }

  // 여러 bookIds에 대해 활성 rental을 반납 처리
  @GrpcMethod()
  async updateRentals(
    updateRentalsRequestDto: UpdateRentalsRequestDto,
  ): Promise<boolean> {
    // 반납되지 않은 rental 레코드 조회
    const rentals = await this.rentalRepository.find({
      where: {
        bookId: In(updateRentalsRequestDto.bookIds),
        returnDate: IsNull(),
      },
    });

    if (rentals.length === 0) {
      throw new NotFoundException('반납할 대여 기록이 없습니다.');
    }

    const now = new Date();
    rentals.forEach((rental) => {
      rental.returnDate = now;
    });

    await this.rentalRepository.save(rentals);
    return true;
  }

  // 여러 bookIds로 rental 생성, 성공 시 true 반환
  @GrpcMethod()
  async createRentals(
    createRentalsRequestDto: CreateRentalsRequestDto,
  ): Promise<boolean> {
    const today = new Date();
    const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); //일주일 뒤

    // 각 bookId에 대해 rental 생성
    const { userId, bookIds } = createRentalsRequestDto;
    const rentals = bookIds.map((bookId) =>
      this.rentalRepository.create({
        userId, // 단축 표기법 사용 (userId: userId)
        bookId,
        rentalDate: today,
        dueDate: oneWeekLater,
      }),
    );

    await this.rentalRepository.save(rentals);
    return true;
  }

  @GrpcMethod()
  async getBookIsAvailable(bookIds: number[]): Promise<{ books: any[] }> {
    // returnDate가 null이면 아직 대여 중인 상태
    const rentals = await this.rentalRepository.find({
      where: {
        bookId: In(bookIds),
        returnDate: IsNull(),
      },
    });

    // 현재 대여 중인 bookId들을 집합(Set)으로 만들기
    const activeBookIds = new Set(rentals.map((rental) => rental.bookId));

    // bookIds 배열을 순회하면서, activeBookIds에 포함되어 있으면 false, 아니면 true
    return {
      books: bookIds.map((bookId) => ({
        bookId,
        isAvailable: !activeBookIds.has(bookId),
      })),
    };
  }

  @GrpcMethod()
  async getRentals(): Promise<{ rentals: any[] }> {
    const rentals = await this.rentalRepository.find(); // await 추가
    return {
      rentals: rentals.map((rental) => ({
        id: rental.id,
        bookId: rental.bookId,
        userId: rental.userId,
        rentalDate: toTimestamp(rental.rentalDate),
        dueDate: toTimestamp(rental.dueDate),
        returnDate: rental.returnDate ? toTimestamp(rental.returnDate) : null,
      })),
    };
  }
}
