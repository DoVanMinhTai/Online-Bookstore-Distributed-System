-- Categories + book-category links (idempotent).
-- Named with a "zz_" prefix so it is loaded after product.sql / brand.sql,
-- ensuring the referenced books already exist.

-- 1) Categories (Cate.id is assigned explicitly, not auto-generated)
INSERT INTO category (id, name, description, active) VALUES
    (1, 'Văn học', 'Tiểu thuyết, truyện ngắn và tác phẩm văn học', true),
    (2, 'Thiếu nhi', 'Sách dành cho thiếu nhi', true),
    (3, 'Tâm lý - Kỹ năng sống', 'Sách phát triển bản thân và kỹ năng sống', true),
    (4, 'Tôn giáo - Thiền', 'Sách về tôn giáo, thiền và an lạc', true),
    (5, 'Kinh tế - Quản trị', 'Sách kinh tế, kinh doanh và quản trị', true),
    (6, 'Sức khỏe', 'Sách về sức khỏe và dinh dưỡng', true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    active = EXCLUDED.active;

-- Keep the category id sequence in sync (in case it is backed by a sequence)
SELECT setval(pg_get_serial_sequence('category', 'id'), (SELECT MAX(id) FROM category))
WHERE pg_get_serial_sequence('category', 'id') IS NOT NULL;

-- 2) Book <-> Category links (only for books that already exist)
INSERT INTO book_cate (book_id, cate_id)
SELECT v.book_id, v.cate_id
FROM (VALUES
    (1, 1),   -- The lovely bones -> Văn học
    (2, 1),   -- Mắt biếc -> Văn học
    (3, 1),   -- Tôi thấy hoa vàng -> Văn học
    (4, 2),   -- Có hai con mèo -> Thiếu nhi
    (5, 1),   -- Ngồi khóc trên cây -> Văn học
    (6, 1),   -- Phòng trọ ba người -> Văn học
    (7, 2),   -- Thiên thần nhỏ -> Thiếu nhi
    (8, 4),   -- Trái tim mặt trời -> Tôn giáo - Thiền
    (9, 4),   -- An lạc từng bước chân -> Tôn giáo - Thiền
    (10, 1),  -- O Alquimista -> Văn học
    (11, 1),  -- Nhà giả kim -> Văn học
    (12, 1),  -- Siddhartha -> Văn học
    (13, 1),  -- Wuthering Heights -> Văn học
    (14, 3),  -- Đắc nhân tâm -> Tâm lý - Kỹ năng sống
    (15, 5),  -- Binh pháp Tôn Tử -> Kinh tế - Quản trị
    (16, 3),  -- Trong chớp mắt -> Tâm lý - Kỹ năng sống
    (17, 3),  -- Ngôn ngữ cơ thể -> Tâm lý - Kỹ năng sống
    (18, 6),  -- Sống 365 ngày -> Sức khỏe
    (19, 6),  -- Ăn gì ngăn ngừa ung thư -> Sức khỏe
    (20, 3)   -- Thanh lọc tâm trí -> Tâm lý - Kỹ năng sống
) AS v(book_id, cate_id)
WHERE EXISTS (SELECT 1 FROM book b WHERE b.id = v.book_id)
  AND EXISTS (SELECT 1 FROM category c WHERE c.id = v.cate_id)
  AND NOT EXISTS (
      SELECT 1 FROM book_cate bc
      WHERE bc.book_id = v.book_id AND bc.cate_id = v.cate_id
  );
