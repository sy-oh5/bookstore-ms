import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RentalGrpcService } from '../service/rental-grpc.service';
import { CreateRentalsRequestDto } from '../dto/create-rentals-request';
import { UpdateRentalsRequestDto } from '../dto/update-rentals-request';

@Controller()
export class RentalGrpcController {
  constructor(private readonly rentalGrpcService: RentalGrpcService) {}

  @GrpcMethod('RentalGrpcService', 'GetBookIsAvailable')
  async getBookIsAvailable(data: {
    bookIds: number[];
  }): Promise<{ books: any[] }> {
    return this.rentalGrpcService.getBookIsAvailable(data.bookIds);
  }

  @GrpcMethod('RentalGrpcService', 'GetRentals')
  async getRentals(): Promise<{ rentals: any[] }> {
    return await this.rentalGrpcService.getRentals();
  }

  @GrpcMethod('RentalGrpcService', 'CreateRentals')
  async createRentals(
    createRentalsRequestDto: CreateRentalsRequestDto,
  ): Promise<{ result: boolean }> {
    const result = await this.rentalGrpcService.createRentals(
      createRentalsRequestDto,
    );
    return { result };
  }

  @GrpcMethod('RentalGrpcService', 'UpdateRentals')
  async updateRentals(
    updateRentalsRequestDto: UpdateRentalsRequestDto,
  ): Promise<{ result: boolean }> {
    const result = await this.rentalGrpcService.updateRentals(
      updateRentalsRequestDto,
    );
    return { result };
  }
}
