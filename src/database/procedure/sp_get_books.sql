CREATE OR REPLACE FUNCTION sp_get_book_by_author(p_author VARCHAR(255))
RETURNS SETOF books AS $$
DECLARE
    result RECORD;
    found_any BOOLEAN := FALSE;
BEGIN
    FOR result IN SELECT * FROM books WHERE author = p_author LOOP
        found_any := TRUE;
        RETURN NEXT result;
    END LOOP;

    IF NOT found_any THEN
        RAISE EXCEPTION 'Book with author % not found', p_author;
    END IF;
END;
$$ LANGUAGE plpgsql;
