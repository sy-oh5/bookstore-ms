import { Injectable } from '@nestjs/common';
import { lastValueFrom, Observable } from 'rxjs';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { CreateRentalsRequestDto } from '../dto/create-rentals-request';
import { UpdateRentalsRequestDto } from '../dto/update-rentals-request';
import { Timestamp, timestampToDate } from '../date.utils';

/**
 * gRPC에서 보내는 timestamp 필드는 실제로 { seconds, nanos } 객체입니다.
 */
interface RentalGrpcResponse {
  rentals: {
    id: number;
    bookId: number;
    userId: number;
    rentalDate: Timestamp;
    dueDate: Timestamp;
    returnDate: Timestamp;
  }[];
}

interface RentalGrpcService {
  getRentals(data: Empty): Observable<RentalGrpcResponse>;
  getBookIsAvailable(data: { bookIds: number[] }): Observable<{
    books: { bookId: number; isAvailable: boolean }[];
  }>;
  createRentals(data: CreateRentalsRequestDto): Observable<{ result: boolean }>;
  updateRentals(data: UpdateRentalsRequestDto): Observable<{ result: boolean }>;
}

@Injectable()
export class RentalService {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'rental',
      protoPath: 'proto/rental.proto',
      url: process.env.RENTAL_GRPC_URL,
    },
  })
  private client: ClientGrpc;
  private rentalGrpcService: RentalGrpcService;

  onModuleInit() {
    this.rentalGrpcService =
      this.client.getService<RentalGrpcService>('RentalGrpcService');
  }

  async getRentals(): Promise<{
    rentals: {
      id: number;
      bookId: number;
      userId: number;
      rentalDate: Date;
      dueDate: Date;
      returnDate: Date | null;
    }[];
  }> {
    const response = await lastValueFrom(this.rentalGrpcService.getRentals({}));

    const rentals = response.rentals.map((rental) => ({
      id: rental.id,
      bookId: rental.bookId,
      userId: rental.userId,
      rentalDate: timestampToDate(rental.rentalDate),
      dueDate: timestampToDate(rental.dueDate),
      returnDate: rental.returnDate ? timestampToDate(rental.returnDate) : null,
    }));

    return { rentals };
  }

  async getBookIsAvailable(bookIds: number[]): Promise<{
    books: { bookId: number; isAvailable: boolean }[];
  }> {
    const response = await lastValueFrom(
      this.rentalGrpcService.getBookIsAvailable({ bookIds }),
    );
    return response;
  }

  async createRentals(
    createRentalsRequestDto: CreateRentalsRequestDto,
  ): Promise<{ result: boolean }> {
    const response = await lastValueFrom(
      this.rentalGrpcService.createRentals(createRentalsRequestDto),
    );
    return response;
  }

  async updateRentals(
    updateRentalsRequestDto: UpdateRentalsRequestDto,
  ): Promise<{ result: boolean }> {
    const response = await lastValueFrom(
      this.rentalGrpcService.updateRentals(updateRentalsRequestDto),
    );
    return response;
  }
}
