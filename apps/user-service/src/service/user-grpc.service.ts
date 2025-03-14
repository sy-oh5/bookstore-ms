/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import { GrpcMethod } from '@nestjs/microservices';

@Injectable()
export class UserGrpcService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //  서비스 실행 시 기본 유저 추가
  async onModuleInit() {
    await this.insertDefaultUsers();
  }

  //  기본 유저 추가 함수
  private async insertDefaultUsers() {
    const existingUsers = await this.userRepository.count();
    if (existingUsers > 0) return; // 이미 유저가 있으면 추가 안 함

    const pw = await bcrypt.hash('password', 10);
    const defaultUsers = [
      {
        name: 'Alice',
        email: 'alice@example.com',
        phone: '010-1234-5678',
        password: pw,
      },
      {
        name: 'Bob',
        email: 'bob@example.com',
        phone: '010-2345-6789',
        password: pw,
      },
      {
        name: 'Charlie',
        email: 'charlie@example.com',
        phone: '010-3456-7890',
        password: pw,
      },
      {
        name: 'David',
        email: 'david@example.com',
        phone: '010-4567-8901',
        password: pw,
      },
      {
        name: 'Eve',
        email: 'eve@example.com',
        phone: '010-5678-9012',
        password: pw,
      },
    ];

    await this.userRepository.save(defaultUsers); //  기본 유저 추가
    console.log(' 기본 유저 5명이 추가되었습니다.');
  }

  @GrpcMethod()
  async getUsers(id?: number[]): Promise<{ users: any[] }> {
    const query = this.userRepository.createQueryBuilder('user');

    if (id && id.length > 0) {
      query.andWhere('user.id IN (:...ids)', { ids: id });
    }

    const users = await query.getMany();

    return {
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
      })),
    };
  }
}
