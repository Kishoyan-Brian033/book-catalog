import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { createDatabasePool } from './../config/database.config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  async onModuleInit() {
    this.pool = createDatabasePool();
    await this.testConnection();
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }

  private async testConnection(): Promise<void> {
    try {
      const book = await this.pool.connect();
      await book.query('SELECT 1');
      book.release();
      console.log('Database connection established succesfully');
    } catch (error) {
      console.error('Failed to connect to database', error);
      throw error;
    }
  }

  async query(text: string, params?: any[]): Promise<any> {
    const book = await this.pool.connect();
    try {
      const result = await book.query(text, params);
      return result;
    } finally {
      book.release();
    }
  }

  async getBook(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async Transaction<T>(callback: (Book: PoolClient) => Promise<T>): Promise<T> {
    const book = await this.pool.connect();
    try {
      await book.query('BEGIN');
      const result = callback(book);
      await book.query('COMMIT');
      return result;
    } catch (error) {
      await book.query('ROOLBACK');
      throw error;
    } finally {
      book.release();
    }
  }
}
