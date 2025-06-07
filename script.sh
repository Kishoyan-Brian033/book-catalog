#!/bin/bash

echo " Setting up Hotel Management Db......"

# Create database 
psql -U postgres -h localhost -c "CREATE DATABASE book_management_db;"

# Runmigration
psql -U postgres -h localhost -d book_management_db -f src/database/migration/001_schema.sql

# Create stored procedures
psql -U postgres -h localhost -d book_management_db -f src/database/procedure/sp_create_books.sql
psql -U postgres -h localhost -d book_management_db -f src/database/procedure/sp_get_books.sql
psql -U postgres -h localhost -d book_management_db -f src/database/procedure/sp_delete_books.sql
psql -U postgres -h localhost -d book_management_db -f src/database/procedure/sp_update_books.sql



echo "Database setup complete....."

echo "You can now run : npm run start:dev"



