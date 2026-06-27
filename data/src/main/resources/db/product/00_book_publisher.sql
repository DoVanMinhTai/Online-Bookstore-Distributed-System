INSERT INTO book_publisher (id, name) VALUES
  (1, 'NXB Trẻ'),
  (2, 'NXB Kim Đồng'),
  (3, 'NXB Tổng Hợp TP.HCM'),
  (4, 'Nhã Nam'),
  (5, 'Alphabooks')
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name;

-- Keep the id sequence in sync with the explicitly inserted ids
SELECT setval(pg_get_serial_sequence('book_publisher', 'id'), (SELECT MAX(id) FROM book_publisher));
