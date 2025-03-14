import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Rental {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookId: number; //  대여한 책 ID

  @Column()
  userId: number; //  대여한 사용자 ID

  @CreateDateColumn()
  rentalDate: Date; //  대여 시작 날짜 (자동 생성)

  @Column({ type: 'timestamp' })
  dueDate: Date; //  반납해야 하는 날짜

  @Column({ type: 'timestamp', nullable: true })
  returnDate?: Date | null; //  실제 반납 날짜 (반납 전이면 NULL)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
