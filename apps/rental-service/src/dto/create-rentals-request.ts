import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateRentalsRequestDto {
  @ApiProperty({ description: '사용자 ID', example: 1 })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: '대여할 책 ID 리스트',
    example: [1, 2],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  bookIds: number[];
}
