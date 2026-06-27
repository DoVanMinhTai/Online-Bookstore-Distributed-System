INSERT INTO book (
    id, name, title, title_without_series, slug, short_description, description,
    specification, num_pages, is_published, is_visible_individually, is_featured,
    is_allowed_to_order, publish_date, isbn13, ratings_count, price, availability,
    dimensions, discount_percentage, item_weight, weight, size, author_name,
    thumbnail_media_id, publisher_Id, brand_id, stock_quantity, meta_title,
    meta_keyword, meta_description, package_dimensions
) VALUES
      (1, 'The lovely bones', 'The lovely bones - Alice Sebold...', 'The lovely bones', 'the-lovely-bones', 'Sách The lovely bones', '<p>Sách The lovely bones</p>', 'Bìa mềm', 250, true, true, true, true, '2000-01-01', NULL, 0, 90000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Alice Sebold', 1, 1, 1, 100, 'Sách The lovely bones', 'lovely, bones', 'Sách The lovely bones', '14x21x3 cm'),
      (2, 'Mắt biếc', 'Mắt biếc - Nhật Ánh Nguyễn', 'Mắt biếc', 'mat-biec', 'Sách Mắt biếc', '<p>Sách Mắt biếc</p>', 'Bìa mềm', 250, true, true, true, true, '2013-01-01', NULL, 0, 100000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Nhật Ánh Nguyễn', 2, 1, 1, 100, 'Sách Mắt biếc', 'mat, biec', 'Sách Mắt biếc', '14x21x3 cm'),
      (3, 'Tôi thấy hoa vàng trên cỏ xanh', 'Tôi thấy hoa vàng...', 'Tôi thấy hoa vàng...', 'toi-thay-hoa-vang', 'Sách Tôi thấy hoa vàng...', '<p>Sách Tôi thấy hoa vàng...</p>', 'Bìa mềm', 250, true, true, true, true, '2011-01-01', NULL, 0, 110000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Nhật Ánh Nguyễn', 3, 1, 1, 100, 'Sách Tôi thấy hoa vàng...', 'hoa, vang', 'Sách Tôi thấy hoa vàng...', '14x21x3 cm'),
      (4, 'Có hai con mèo ngồi bên cửa sổ', 'Có hai con mèo...', 'Có hai con mèo...', 'co-hai-con-meo', 'Sách Có hai con mèo...', '<p>Sách Có hai con mèo...</p>', 'Bìa mềm', 250, true, true, true, true, '2012-01-01', NULL, 0, 120000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Nhật Ánh Nguyễn', 4, 1, 1, 100, 'Sách Có hai con mèo...', 'meo, cua, so', 'Sách Có hai con mèo...', '14x21x3 cm'),
      (5, 'Ngồi khóc trên cây', 'Ngồi khóc trên cây...', 'Ngồi khóc trên cây', 'ngoi-khoc-tren-cay', 'Sách Ngồi khóc trên cây', '<p>Sách Ngồi khóc trên cây</p>', 'Bìa mềm', 250, true, true, true, true, '2013-01-01', NULL, 0, 130000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Nhật Ánh Nguyễn', 5, 1, 1, 100, 'Sách Ngồi khóc trên cây', 'ngoi, khoc', 'Sách Ngồi khóc trên cây', '14x21x3 cm'),
      (6, 'Phòng trọ ba người', 'Phòng trọ ba người...', 'Phòng trọ ba người', 'phong-tro-ba-nguoi', 'Sách Phòng trọ ba người', '<p>Sách Phòng trọ ba người</p>', 'Bìa mềm', 250, true, true, true, true, '2012-01-01', NULL, 0, 140000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Nhật Ánh Nguyễn', 6, 2, 2, 100, 'Sách Phòng trọ ba người', 'phong, tro', 'Sách Phòng trọ ba người', '14x21x3 cm'),
      (7, 'Thiên thần nhỏ của tôi', 'Thiên thần nhỏ...', 'Thiên thần nhỏ...', 'thien-than-nho', 'Sách Thiên thần nhỏ...', '<p>Sách Thiên thần nhỏ...</p>', 'Bìa mềm', 250, true, true, false, true, '2013-01-01', NULL, 0, 150000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Nhật Ánh Nguyễn', 7, 2, 2, 100, 'Sách Thiên thần nhỏ...', 'thien, than', 'Sách Thiên thần nhỏ...', '14x21x3 cm'),
      (8, 'Trái tim mặt trời', 'Trái tim mặt trời...', 'Trái tim mặt trời', 'trai-tim-mat-troi', 'Sách Trái tim mặt trời', '<p>Sách Trái tim mặt trời</p>', 'Bìa mềm', 250, true, true, false, true, '1982-01-01', NULL, 0, 160000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Thích Nhất Hạnh', 8, 2, 2, 100, 'Sách Trái tim mặt trời', 'trai, tim', 'Sách Trái tim mặt trời', '14x21x3 cm'),
      (9, 'An lạc từng bước chân', 'An lạc từng bước...', 'An lạc từng bước...', 'an-lac-tung-buoc', 'Sách An lạc từng bước...', '<p>Sách An lạc từng bước...</p>', 'Bìa mềm', 250, true, true, false, true, '2011-01-01', NULL, 0, 170000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Thích Nhất Hạnh', 9, 3, 3, 100, 'Sách An lạc từng bước...', 'an, lac', 'Sách An lạc từng bước...', '14x21x3 cm'),
      (10, 'O Alquimista', 'O Alquimista - Paulo...', 'O Alquimista', 'o-alquimista', 'Sách O Alquimista', '<p>Sách O Alquimista</p>', 'Bìa mềm', 250, true, true, false, true, '1988-01-01', NULL, 0, 180000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Paulo Coelho', 10, 3, 3, 100, 'Sách O Alquimista', 'alquimista', 'Sách O Alquimista', '14x21x3 cm'),
      (11, 'Nhà giả kim', 'Nhà giả kim - Paulo...', 'Nhà giả kim', 'nha-gia-kim', 'Sách Nhà giả kim', '<p>Sách Nhà giả kim</p>', 'Bìa mềm', 250, true, true, false, true, '2016-01-01', NULL, 0, 90000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Paulo Coelho', 11, 3, 3, 100, 'Sách Nhà giả kim', 'gia, kim', 'Sách Nhà giả kim', '14x21x3 cm'),
      (12, 'Siddhartha', 'Siddhartha - Hermann...', 'Siddhartha', 'siddhartha', 'Sách Siddhartha', '<p>Sách Siddhartha</p>', 'Bìa mềm', 250, true, true, false, true, '1922-01-01', NULL, 0, 100000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Hermann Hesse', 12, 4, 4, 100, 'Sách Siddhartha', 'siddhartha', 'Sách Siddhartha', '14x21x3 cm'),
      (13, 'Wuthering Heights', 'Wuthering Heights...', 'Wuthering Heights', 'wuthering-heights', 'Sách Wuthering Heights', '<p>Sách Wuthering Heights</p>', 'Bìa mềm', 250, true, true, false, true, '1846-01-01', NULL, 0, 110000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Emily Brontë', 13, 4, 4, 100, 'Sách Wuthering Heights', 'wuthering', 'Sách Wuthering Heights', '14x21x3 cm'),
      (14, 'Đắc nhân tâm', 'How to Win Friends...', 'How to Win Friends...', 'dac-nhan-tam', 'Sách Đắc nhân tâm', '<p>Sách Đắc nhân tâm</p>', 'Bìa mềm', 250, true, true, false, true, '1936-01-01', NULL, 0, 120000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Dale Carnegie', 14, 4, 4, 100, 'Sách Đắc nhân tâm', 'dac, nhan, tam', 'Sách Đắc nhân tâm', '14x21x3 cm'),
      (15, 'Binh pháp Tôn Tử', 'The Art of War...', 'The Art of War', 'binh-phap-ton-tu', 'Sách Binh pháp Tôn Tử', '<p>Sách Binh pháp Tôn Tử</p>', 'Bìa mềm', 250, true, true, false, true, '1900-01-01', NULL, 0, 130000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Tôn Tử', 15, 5, 5, 100, 'Sách Binh pháp Tôn Tử', 'binh, phap', 'Sách Binh pháp Tôn Tử', '14x21x3 cm'),
      (16, 'Trong chớp mắt', 'Blink - Malcolm Gladwell', 'Blink', 'trong-chop-mat', 'Sách Trong chớp mắt', '<p>Sách Trong chớp mắt</p>', 'Bìa mềm', 250, true, true, false, true, '2004-01-01', NULL, 0, 140000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Malcolm Gladwell', 16, 5, 5, 100, 'Sách Trong chớp mắt', 'blink', 'Sách Trong chớp mắt', '14x21x3 cm'),
      (17, 'Ngôn ngữ cơ thể', 'The Definitive Book...', 'Body Language', 'ngon-ngu-co-the', 'Sách Ngôn ngữ cơ thể', '<p>Sách Ngôn ngữ cơ thể</p>', 'Bìa mềm', 250, true, true, false, true, '2004-01-01', NULL, 0, 150000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Allan Pease', 17, 5, 5, 100, 'Sách Ngôn ngữ cơ thể', 'body, language', 'Sách Ngôn ngữ cơ thể', '14x21x3 cm'),
      (18, 'Sống 365 ngày một năm', 'How to live 365 days...', 'How to live 365 days', 'song-365-ngay', 'Sách Sống 365 ngày...', '<p>Sách Sống 365 ngày...</p>', 'Bìa mềm', 250, true, true, false, true, '1954-01-01', NULL, 0, 160000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'John A. Schindler', 18, 1, 5, 100, 'Sách Sống 365 ngày', '365, ngay', 'Sách Sống 365 ngày', '14x21x3 cm'),
      (19, 'Ăn gì ngăn ngừa ung thư', 'Tell Me What to Eat...', 'Tell Me What to Eat', 'an-gi-ngan-ung-thu', 'Sách Ăn gì ngăn ngừa...', '<p>Sách Ăn gì ngăn ngừa...</p>', 'Bìa mềm', 250, true, true, false, true, '2000-01-01', NULL, 0, 170000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Elaine Magee', 19, 2, 4, 100, 'Sách Ăn gì ngăn ngừa', 'cancer, eat', 'Sách Ăn gì ngăn ngừa', '14x21x3 cm'),
      (20, 'Thanh lọc tâm trí', 'Detox Your Mind...', 'Detox Your Mind', 'thanh-loc-tam-tri', 'Sách Thanh lọc tâm trí', '<p>Sách Thanh lọc tâm trí</p>', 'Bìa mềm', 250, true, true, false, true, '2000-01-01', NULL, 0, 180000, 100, '13x20.5 cm', 10, 0.4, 400, 'Vừa', 'Jane Scrivner', 20, 3, 2, 100, 'Sách Thanh lọc tâm trí', 'detox', 'Sách Thanh lọc tâm trí', '14x21x3 cm')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    title_without_series = EXCLUDED.title_without_series,
    slug = EXCLUDED.slug,
    short_description = EXCLUDED.short_description,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    author_name = EXCLUDED.author_name,
    thumbnail_media_id = EXCLUDED.thumbnail_media_id,
    publisher_Id = EXCLUDED.publisher_Id,
    brand_id = EXCLUDED.brand_id,
    is_published = EXCLUDED.is_published,
    is_featured = EXCLUDED.is_featured;

-- Keep the id sequence in sync with the explicitly inserted ids
SELECT setval(pg_get_serial_sequence('book', 'id'), (SELECT MAX(id) FROM book));
