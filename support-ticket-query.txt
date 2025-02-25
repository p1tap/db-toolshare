psql -U postgres -h localhost -d toolshare

toolshare=# SELECT * FROM support_requests ORDER BY created_at DESC;