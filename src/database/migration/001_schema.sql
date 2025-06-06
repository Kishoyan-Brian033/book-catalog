CREATE TABLE IF NOT EXIST books(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    published_year INTEGER,
    isbn INTEGER
);

-- create index 

CREATE INDEX IF NOT EXIST idx_books_title ON books(title);
CREATE INDEX IF NOT EXIST idx_books_author ON books(author);
CREATE INDEX IF NOT EXIST idx_books_published_year ON books(published_year;