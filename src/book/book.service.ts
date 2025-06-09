/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { Book } from './interfaces/book.interface';
import { createBookDto } from './dtos/create-boo.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { DatabaseService } from '../database/connection.service';

@Injectable()
export class BooksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: createBookDto): Promise<Book> {
    try {
      const result = await this.databaseService.query(
        `SELECT * FROM sp_create_book($1, $2, $3, $4)`,
        [data.title, data.author, data.published_year, data.isbn],
      );

      if (result.rows.length === 0) {
        throw new InternalServerErrorException('Failed to create book');
      }

      return this.mapRowToBook(result.rows[0]);
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        throw new ConflictException('A book with this ISBN already exists');
      }
      throw new InternalServerErrorException('Failed to create book');
    }
  }

  async findAll(): Promise<Book[]> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_all_books()',
      );

      return result.rows.map(this.mapRowToBook);
    } catch {
      throw new InternalServerErrorException('Failed to retrieve books');
    }
  }

  async findAvailable(): Promise<Book[]> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_available_books()',
      );
      return result.rows.map(this.mapRowToBook);
    } catch {
      throw new InternalServerErrorException(
        'Failed to retrieve available books',
      );
    }
  }

  async findOne(id: number): Promise<Book> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_book_by_id($1)',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }

      return this.mapRowToBook(result.rows[0]);
    } catch {
      throw new InternalServerErrorException('Failed to retrieve book');
    }
  }

  async findByIsbn(isbn: string): Promise<Book> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_book_by_isbn($1)',
        [isbn],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with ISBN ${isbn} not found`);
      }

      return this.mapRowToBook(result.rows[0]);
    } catch {
      throw new InternalServerErrorException('Failed to retrieve book');
    }
  }

  async update(id: number, data: UpdateBookDto): Promise<Book> {
    try {
      const result = await this.databaseService.query(
        `SELECT * FROM sp_update_book($1, $2, $3, $4)`,
        [
          data.title || null,
          data.author || null,
          data.published_year || null,
          data.isbn || null,
        ],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }

      return this.mapRowToBook(result.rows[0]);
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      if (error.message?.includes('ISBN already exists')) {
        throw new ConflictException('Another book with this ISBN exists');
      }
      throw new InternalServerErrorException('Failed to update book');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_soft_delete_book($1)',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }

      return { message: result.rows[0].message };
    } catch {
      throw new InternalServerErrorException('Failed to soft delete book');
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_hard_delete_book($1)',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }

      return { message: result.rows[0].message };
    } catch {
      throw new InternalServerErrorException('Failed to delete book');
    }
  }

  private mapRowToBook(row: any): Book {
    return {
      id: row.id,
      title: row.title,
      author: row.author,
      published_year: row.published_year,
      isbn: row.isbn,
    };
  }
}
