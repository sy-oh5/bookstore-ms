import { Injectable } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { RentalService } from '../service/rental.service';
import { BookService } from '../service/book.service';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UserAggregator {
  constructor(
    private readonly userService: UserService,
    private readonly rentalService: RentalService,
    private readonly bookService: BookService,
  ) {}

  async getUsers(): Promise<UserResponseDto[]> {
    // 1. 사용자 정보 조회
    const users = (await this.userService.getUsers()).users;

    // 2. 최종 UserResponseDto 생성 후 배열로 반환
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
    }));
  }
}
