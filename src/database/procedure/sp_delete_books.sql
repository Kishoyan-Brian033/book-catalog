CREATE OR REPLACE FUNCTION sp_soft_delete_user(p_id INTEGER)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    book_title VARCHAR(255)
)