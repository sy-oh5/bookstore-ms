import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: '유저의 고유 ID' })
  id: number;

  @ApiProperty({ example: 'alice@example.com', description: '이메일' })
  email: string;

  @ApiProperty({ example: 'Alice', description: '유저 이름' })
  name: string;

  @ApiProperty({ example: '010-1234-5678', description: '유저 전화번호' })
  phone: string;
}
