INSERT INTO brand (name, slug, is_published, created_by) VALUES
                                                             ('Nhà Xuất Bản Trẻ', 'nha-xuat-ban-tre', true, 'admin'),
                                                             ('Alpha Books', 'alpha-books', true, 'admin'),
                                                             ('Nhã Nam', 'nha-nam', true, 'admin'),
                                                             ('Kim Đồng', 'kim-dong', true, 'admin'),
                                                             ('NXB Tổng Hợp', 'nxb-tong-hop', true, 'system')
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    is_published = EXCLUDED.is_published;
