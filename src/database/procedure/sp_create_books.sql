CREATE OR REPLACE FUNCTION sp_create_book(
    p_title VARCHAR(255),
    p_author VARCHAR(255),
    p_published_year INTEGER,
    p_isbn VARCHAR(13)
)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(255),
    author VARCHAR(255),
    published_year INTEGER,
    isbn VARCHAR(13)
) AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM books WHERE title = p_title) THEN
        RAISE EXCEPTION 'Book with title "%" already exists', p_title;
    END IF;
    RETURN QUERY
    INSERT INTO books (title, author, published_year, isbn)
    VALUES (p_title, p_author, p_published_year, p_isbn)
    RETURNING id, title, author, published_year, isbn;
END;
$$ LANGUAGE plpgsql;
