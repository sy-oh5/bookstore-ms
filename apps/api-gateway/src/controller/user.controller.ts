import { Controller, Get } from '@nestjs/common';
import { UserAggregator } from '../aggregator/user.aggregator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from '../dto/user-response.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userAggregator: UserAggregator) {}

  @Get()
  @ApiOperation({
    summary: '전체 사용자 정보 조회',
    description: '전체 사용자 정보 조회',
  })
  @ApiResponse({
    status: 200,
    type: [UserResponseDto],
  })
  async getUsers(): Promise<UserResponseDto[]> {
    return await this.userAggregator.getUsers();
  }
}
