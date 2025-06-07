CREATE TABLE IF NOT EXISTS books(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    published_year INTEGER,
    isbn VARCHAR(13) UNIQUE
);

-- create index 

CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_published_year ON books(published_year);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);


--stored procedure to count book by publication year
CREATE OR REPLACE FUNCTION count_books_by_year(year_input INTEGER)
RETURNS INTEGER AS $$
DECLARE
    book_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO book_count 
    FROM books 
    WHERE published_year = year_input;
    
    RETURN book_count;
END;
$$ LANGUAGE plpgsql;