CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    published_year INTEGER,
    isbn VARCHAR(13) UNIQUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for faster searching/filtering
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_published_year ON books(published_year);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);

-- Trigger function to update updated_at on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach the trigger to the books table
CREATE TRIGGER trg_update_updated_at
BEFORE UPDATE ON books
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Stored procedure to insert a book and return inserted record
CREATE OR REPLACE FUNCTION sp_create_book(
  p_title TEXT,
  p_author TEXT,
  p_published_year INT,
  p_isbn VARCHAR
)
RETURNS TABLE (
  id INT,
  title TEXT,
  author TEXT,
  published_year INT,
  isbn VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO books (title, author, published_year, isbn)
  VALUES (p_title, p_author, p_published_year, p_isbn)
  RETURNING id, title, author, published_year, isbn;
END;
$$ LANGUAGE plpgsql;

-- Stored procedure to count number of books by published year
CREATE OR REPLACE FUNCTION sp_count_books_by_year(p_year INT)
RETURNS INT AS $$
DECLARE
  book_count INT;
BEGIN
  SELECT COUNT(*) INTO book_count FROM books WHERE published_year = p_year;
  RETURN book_count;
END;
$$ LANGUAGE plpgsql;
