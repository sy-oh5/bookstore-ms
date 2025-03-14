import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateRentalsRequestDto {
  @ApiProperty({
    description: '반납할 책 ID 리스트',
    example: [1, 2],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  bookIds: number[];
}
