import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BooksService } from './book.service';
import { createBookDto } from '../book/dtos/create-boo.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { ApiResponse } from 'src/shared/interfaces/api-response/api-response.interface';
import { Book } from './interfaces/book.interface';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: createBookDto): ApiResponse<Book> {
    try {
      const book = this.booksService.create(data);
      return {
        success: true,
        message: 'Book created successfully',
        data: book,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get()
  findAll(@Query('available') available?: string): ApiResponse<Book[]> {
    try {
      const books =
        available === 'true'
          ? this.booksService.findAvailable()
          : this.booksService.findAll();

      return {
        success: true,
        message: `Retrieved ${books.length} book(s)`,
        data: books,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve books',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): ApiResponse<Book> {
    try {
      const book = this.booksService.findOne(id);
      return {
        success: true,
        message: 'Book found',
        data: book,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Book not found',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateBookDto,
  ): ApiResponse<Book> {
    try {
      const updated = this.booksService.update(id, data);
      return {
        success: true,
        message: 'Book updated successfully',
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): ApiResponse<null> {
    try {
      const result = this.booksService.remove(id);
      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to remove book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Delete(':id/permanent')
  delete(@Param('id', ParseIntPipe) id: number): ApiResponse<null> {
    try {
      const result = this.booksService.delete(id);
      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to permanently delete book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
