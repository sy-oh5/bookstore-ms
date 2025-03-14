import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 100 })
  email: string; //  로그인 ID (고유값)

  @Column()
  password: string; //  암호화된 비밀번호 저장

  @Column({ unique: true, length: 20 })
  phone: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean; //  사용자 활성화 여부 (탈퇴한 경우 false)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
