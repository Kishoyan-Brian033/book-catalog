import { Module } from '@nestjs/common';
import { BooksController } from './book.controller';
import { BooksService } from './book.service';
import { DatabaseService } from './../database/connection.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService, DatabaseService],
})
export class BookModule {}
