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
} from '@nestjs/common';
import { BooksService } from './book.service';
import { createBookDto } from './dtos/create-boo.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { ApiResponse } from 'src/shared/interfaces/api-response/api-response.interface';
import { Book } from './interfaces/book.interface';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: createBookDto): Promise<ApiResponse<Book>> {
    try {
      const book = await this.booksService.create(data);
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
  async findAll(): Promise<ApiResponse<Book[]>> {
    try {
      const books = await this.booksService.findAll();
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
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<Book>> {
    try {
      const book = await this.booksService.findOne(id);
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateBookDto,
  ): Promise<ApiResponse<Book>> {
    try {
      const updatedBook = await this.booksService.update(id, data);
      return {
        success: true,
        message: 'Book updated successfully',
        data: updatedBook,
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
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    try {
      const result = await this.booksService.remove(id);
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
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    try {
      const result = await this.booksService.delete(id);
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
