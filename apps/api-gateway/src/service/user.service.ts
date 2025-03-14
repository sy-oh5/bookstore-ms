import { Injectable } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';

interface UserGrpcService {
  getUsers(data: { id?: number[] }): Observable<{
    users: { id: number; email: string; phone: string; name: string }[];
  }>;
}

@Injectable()
export class UserService {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: 'proto/user.proto',
      url: process.env.USER_GRPC_URL, // 환경 변수나 실제 URL로 설정
    },
  })
  private client: ClientGrpc;
  private userGrpcService: UserGrpcService;

  onModuleInit() {
    this.userGrpcService =
      this.client.getService<UserGrpcService>('UserGrpcService');
  }

  async getUsers(id?: number[]): Promise<{
    users: { id: number; email: string; phone: string; name: string }[];
  }> {
    const response = await lastValueFrom(this.userGrpcService.getUsers({ id }));
    return {
      users: response.users.map((user) => ({
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
      })),
    };
  }
}
