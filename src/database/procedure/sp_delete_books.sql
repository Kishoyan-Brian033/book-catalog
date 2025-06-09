CREATE OR REPLACE FUNCTION sp_hard_delete_book(p_id INTEGER)
RETURNS TABLE (
  message TEXT
) AS $$
DECLARE
  book_title TEXT;
BEGIN
  SELECT title INTO book_title FROM books WHERE id = p_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Book with ID % not found', p_id;
  END IF;

  DELETE FROM books WHERE id = p_id;

  RETURN QUERY SELECT format('Book "%s" has been permanently deleted', book_title);
END;
$$ LANGUAGE plpgsql;
