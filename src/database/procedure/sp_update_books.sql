CREATE OR REPLACE FUNCTION sp_update_book(
    p_id INTEGER,
    p_title VARCHAR,
    p_author VARCHAR,
    p_published_year INTEGER,
    p_isbn VARCHAR
)
RETURNS VOID AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM books WHERE id = p_id) THEN
        RAISE EXCEPTION 'Book with id % not found', p_id;
    END IF;

    UPDATE books
    SET
        title = p_title,
        author = p_author,
        published_year = p_published_year,
        isbn = p_isbn,
        updated_at = NOW()
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;
