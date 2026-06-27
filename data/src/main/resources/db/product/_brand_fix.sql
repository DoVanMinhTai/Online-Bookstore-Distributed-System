INSERT INTO brand (id, name, slug, is_published, created_by) OVERRIDING SYSTEM VALUE VALUES
    (1, 'Nhà Xuất Bản Trẻ', 'nha-xuat-ban-tre', true, 'admin'),
    (2, 'Alpha Books', 'alpha-books', true, 'admin'),
    (3, 'Nhã Nam', 'nha-nam', true, 'admin'),
    (4, 'Kim Đồng', 'kim-dong', true, 'admin'),
    (5, 'NXB Tổng Hợp', 'nxb-tong-hop', true, 'system')
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    is_published = EXCLUDED.is_published;

SELECT setval(pg_get_serial_sequence('brand', 'id'), (SELECT MAX(id) FROM brand));
