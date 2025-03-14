import { ApiProperty } from '@nestjs/swagger';

export class RentalResponseDto {
  @ApiProperty({ description: '대여 ID' })
  id: number;

  @ApiProperty({ description: '대여한 책 ID' })
  bookId: number;

  @ApiProperty({ description: '대여한 책 제목' })
  bookName: string;

  @ApiProperty({ description: '대여한 사용자 ID' })
  userId: number;

  @ApiProperty({ description: '대여한 사용자명' })
  userName: string;

  @ApiProperty({ description: '대여 시작 날짜' })
  rentalDate: Date;

  @ApiProperty({ description: '반납해야 하는 날짜' })
  dueDate: Date;

  @ApiProperty({
    description: '실제 반납 날짜 (반납 전이면 NULL)',
    nullable: true,
  })
  returnDate?: Date | null;
}
