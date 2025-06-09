CREATE OR REPLACE FUNCTION sp_update_book(
  p_id INTEGER,
  p_title TEXT,
  p_author TEXT,
  p_published_year INTEGER,
  p_isbn TEXT
)
RETURNS TABLE (
  id INTEGER,
  title TEXT,
  author TEXT,
  published_year INTEGER,
  isbn TEXT
) AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM books WHERE id = p_id) THEN
    RAISE EXCEPTION 'Book with ID % not found', p_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM books WHERE isbn = p_isbn AND id != p_id
  ) THEN
    RAISE EXCEPTION 'ISBN already exists for another book';
  END IF;

  UPDATE books SET
    title = COALESCE(p_title, title),
    author = COALESCE(p_author, author),
    published_year = COALESCE(p_published_year, published_year),
    isbn = COALESCE(p_isbn, isbn)
  WHERE id = p_id;

  RETURN QUERY
  SELECT id, title, author, published_year, isbn FROM books WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;
