import { Controller, Post, Put, Body, Get } from '@nestjs/common';
import { RentalAggregator } from '../aggregator/rental.aggregator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RentalResponseDto } from '../dto/rental-response.dto';
import { CreateRentalsRequestDto } from '../dto/create-rentals-request';
import { UpdateRentalsRequestDto } from '../dto/update-rentals-request';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalAggregator: RentalAggregator) {}

  @ApiOperation({
    summary: '대여/반납 목록',
    description: '전체 대여/반납 목록 조회',
  })
  @ApiResponse({
    status: 200,
    type: [RentalResponseDto],
  })
  @Get()
  async getRentals(): Promise<RentalResponseDto[]> {
    return this.rentalAggregator.getRentals();
  }

  @ApiOperation({
    summary: '대여',
    description: '사용자 id로 대여',
  })
  @ApiResponse({
    status: 200,
    description: '대여 성공',
    type: [Boolean],
  })
  @Post()
  async createRentals(
    @Body() createRentalsRequestDto: CreateRentalsRequestDto,
  ): Promise<{ result: boolean }> {
    return await this.rentalAggregator.createRentals(createRentalsRequestDto);
  }

  @ApiOperation({
    summary: '반납',
    description: '사용자 id로 반납',
  })
  @ApiResponse({
    status: 200,
    type: [Boolean],
  })
  @Put()
  async updateRentals(
    @Body() updateRentalsRequestDto: UpdateRentalsRequestDto,
  ): Promise<{ result: boolean }> {
    return await this.rentalAggregator.updateRentals(updateRentalsRequestDto);
  }
}
