import { Controller } from '@nestjs/common';
import { UserGrpcService } from '../service/user-grpc.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('users')
export class UserGrpcController {
  constructor(private readonly userGrpcService: UserGrpcService) {}

  //  특정 유저 조회 API (ID 기준)
  @GrpcMethod('UserGrpcService', 'getUsers')
  async getUsers(data: { id?: number[] }): Promise<{ users: any }> {
    return await this.userGrpcService.getUsers(data.id);
  }
}
