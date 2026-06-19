UPDATE servicerequest
SET status = 'Pending'
WHERE status IS NULL;