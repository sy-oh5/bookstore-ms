import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookController } from './controller/book.controller';
import { BookService } from './service/book.service';
import { BookAggregator } from './aggregator/book.aggregator';
import { RentalService } from './service/rental.service';
import { RentalController } from './controller/rental.controller';
import { RentalAggregator } from './aggregator/rental.aggregator';
import { UserService } from './service/user.service';
import { UserAggregator } from './aggregator/user.aggregator';
import { UserController } from './controller/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [BookController, RentalController, UserController],
  providers: [
    BookService,
    BookAggregator,
    RentalService,
    RentalAggregator,
    UserService,
    UserAggregator,
  ],
})
export class AppModule {}
