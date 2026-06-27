-- Table: media
-- Description: Crawled images for book covers (Open Library)

INSERT INTO media (id, caption, file_name, file_path, media_type) VALUES
  (1, 'Bìa sách The lovely bones', 'the-lovely-bones-alice-sebold-dunow-and-carlson-lit-agency-maria-roura-mir.jpg', '/images/books/the-lovely-bones-alice-sebold-dunow-and-carlson-lit-agency-maria-roura-mir.jpg', 'image/jpeg'),
  (2, 'Bìa sách Má̆t bié̂c', 'mat-biec-nhat-anh-nguyen.jpg', '/images/books/mat-biec-nhat-anh-nguyen.jpg', 'image/jpeg'),
  (3, 'Bìa sách Tôi thấy hoa vàng trên cỏ xanh', 'toi-thay-hoa-vang-tren-co-xanh-nhat-anh-nguyen.jpg', '/images/books/toi-thay-hoa-vang-tren-co-xanh-nhat-anh-nguyen.jpg', 'image/jpeg'),
  (4, 'Bìa sách Có hai con mèo ngồi bên cửa sổ', 'co-hai-con-meo-ngoi-ben-cua-so-nhat-anh-nguyen.jpg', '/images/books/co-hai-con-meo-ngoi-ben-cua-so-nhat-anh-nguyen.jpg', 'image/jpeg'),
  (5, 'Bìa sách Ngồi khóc trên cây', 'ngoi-khoc-tren-cay-nhat-anh-nguyen.jpg', '/images/books/ngoi-khoc-tren-cay-nhat-anh-nguyen.jpg', 'image/jpeg'),
  (6, 'Bìa sách Phòng trọ ba người', 'phong-tro-ba-nguoi-nhat-anh-nguyen.jpg', '/images/books/phong-tro-ba-nguoi-nhat-anh-nguyen.jpg', 'image/jpeg'),
  (7, 'Bìa sách Thiên thần nhỏ của tôi', 'thien-than-nho-cua-toi-nhat-anh-nguyen.jpg', '/images/books/thien-than-nho-cua-toi-nhat-anh-nguyen.jpg', 'image/jpeg'),
  (8, 'Bìa sách Trái tim mặt trời', 'trai-tim-mat-troi-thich-nhat-hanh.jpg', '/images/books/trai-tim-mat-troi-thich-nhat-hanh.jpg', 'image/jpeg'),
  (9, 'Bìa sách An lạc từng bước chân', 'an-lac-tung-buoc-chan-thich-nhat-hanh.jpg', '/images/books/an-lac-tung-buoc-chan-thich-nhat-hanh.jpg', 'image/jpeg'),
  (10, 'Bìa sách O Alquimista', 'o-alquimista-paulo-coelho.jpg', '/images/books/o-alquimista-paulo-coelho.jpg', 'image/jpeg'),
  (11, 'Bìa sách Nhà giả kim', 'nha-gia-kim-paulo-coelho.jpg', '/images/books/nha-gia-kim-paulo-coelho.jpg', 'image/jpeg'),
  (12, 'Bìa sách Siddhartha', 'siddhartha-hermann-hesse.jpg', '/images/books/siddhartha-hermann-hesse.jpg', 'image/jpeg'),
  (13, 'Bìa sách Wuthering Heights', 'wuthering-heights-emily-bronte.jpg', '/images/books/wuthering-heights-emily-bronte.jpg', 'image/jpeg'),
  (14, 'Bìa sách How to Win Friends and Influence People', 'how-to-win-friends-and-influence-people-dale-carnegie.jpg', '/images/books/how-to-win-friends-and-influence-people-dale-carnegie.jpg', 'image/jpeg'),
  (15, 'Bìa sách The Art of War', 'the-art-of-war-stephen-f-kaufman-lionel-giles-onesimo-colavidas.jpg', '/images/books/the-art-of-war-stephen-f-kaufman-lionel-giles-onesimo-colavidas.jpg', 'image/jpeg'),
  (16, 'Bìa sách Blink', 'blink-malcolm-gladwell.jpg', '/images/books/blink-malcolm-gladwell.jpg', 'image/jpeg'),
  (17, 'Bìa sách The Definitive Book of Body Language', 'the-definitive-book-of-body-language-allan-pease-barbara-pease.jpg', '/images/books/the-definitive-book-of-body-language-allan-pease-barbara-pease.jpg', 'image/jpeg'),
  (18, 'Bìa sách How to live 365 days a year', 'how-to-live-365-days-a-year-john-a-schindler.jpg', '/images/books/how-to-live-365-days-a-year-john-a-schindler.jpg', 'image/jpeg'),
  (19, 'Bìa sách Tell Me What to Eat to Help Prevent Breast Cancer', 'tell-me-what-to-eat-to-help-prevent-breast-cancer-elaine-magee.jpg', '/images/books/tell-me-what-to-eat-to-help-prevent-breast-cancer-elaine-magee.jpg', 'image/jpeg'),
  (20, 'Bìa sách Detox Your Mind', 'detox-your-mind-jane-scrivner.jpg', '/images/books/detox-your-mind-jane-scrivner.jpg', 'image/jpeg')
ON CONFLICT (id) DO UPDATE SET
    caption = EXCLUDED.caption,
    file_name = EXCLUDED.file_name,
    file_path = EXCLUDED.file_path,
    media_type = EXCLUDED.media_type;

-- Keep the id sequence in sync with the explicitly inserted ids
SELECT setval(pg_get_serial_sequence('media', 'id'), (SELECT MAX(id) FROM media));
