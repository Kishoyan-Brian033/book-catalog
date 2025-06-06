import { UpdateBookDto } from './dtos/update-book.dto';
import { createBookDto } from './dtos/create-boo.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Book } from './interfaces/book.interface';

@Injectable()
export class BooksService {
  findAvailable(): Book[] {
    throw new Error('Method not implemented.');
  }
  private books: Book[] = [
    {
      id: 1,
      title: 'Game of Thrones',
      author: 'Ned Stark',
      published_year: 2008,
      isbn: 1 - 56619 - 909 - 3,
    },
  ];

  private nextId = 2;

  create(data: createBookDto): Book {
    const existingBook = this.books.find((book) => book.title === data.title);

    if (existingBook) {
      throw new ConflictException(
        `Book with title ${data.title} already exists`,
      );
    }

    const newBook: Book = {
      id: this.nextId++,
      ...data,
    };

    this.books.push(newBook);
    return newBook;
  }

  findAll(): Book[] {
    return this.books;
  }

  findOne(id: number): Book {
    const book = this.books.find((book) => book.id === id);
    if (!book) {
      throw new ConflictException(`Book with ID ${id} not found`);
    }
    return book;
  }

  update(id: number, updateData: UpdateBookDto): Book {
    const bookIndex = this.books.findIndex((book) => book.id === id);
    if (bookIndex === -1) {
      throw new ConflictException(`Book with ID ${id} not found`);
    }

    this.books[bookIndex] = {
      ...this.books[bookIndex],
      ...updateData,
    };

    return this.books[bookIndex];
  }

  remove(id: number): { message: string } {
    const bookIndex = this.books.findIndex((book) => book.id === id);
    if (bookIndex === 1) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    return {
      message: `Guest  ${this.books[bookIndex].title} has checked out succesfully`,
    };
  }

  delete(id: number): { message: string } {
    const bookIndex = this.books.findIndex((book) => book.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    const deletedBook = this.books.splice(bookIndex, 1)[0];

    return {
      message: `Book ${deletedBook.title} has been permanently deleted`,
    };
  }
}
