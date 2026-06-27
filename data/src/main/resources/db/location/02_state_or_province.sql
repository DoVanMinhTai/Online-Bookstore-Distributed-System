-- Seed 34 tỉnh/thành phố Việt Nam (theo sắp xếp đơn vị hành chính có hiệu lực từ 01/07/2025)
-- 6 thành phố trực thuộc trung ương + 28 tỉnh.
-- Idempotent: chỉ chèn khi chưa tồn tại (theo name + country).
INSERT INTO state_or_province (name, code, type, country_id)
SELECT v.name, v.code, v.type, c.id
FROM (VALUES
    -- Thành phố trực thuộc trung ương
    ('Thành phố Hà Nội',           'HN',  'THANH_PHO_TRUC_THUOC_TW'),
    ('Thành phố Hải Phòng',        'HP',  'THANH_PHO_TRUC_THUOC_TW'),
    ('Thành phố Huế',              'HUE', 'THANH_PHO_TRUC_THUOC_TW'),
    ('Thành phố Đà Nẵng',          'DN',  'THANH_PHO_TRUC_THUOC_TW'),
    ('Thành phố Hồ Chí Minh',      'HCM', 'THANH_PHO_TRUC_THUOC_TW'),
    ('Thành phố Cần Thơ',          'CT',  'THANH_PHO_TRUC_THUOC_TW'),
    -- Tỉnh
    ('Tỉnh Lai Châu',              'LC',  'TINH'),
    ('Tỉnh Điện Biên',             'DB',  'TINH'),
    ('Tỉnh Sơn La',                'SL',  'TINH'),
    ('Tỉnh Lạng Sơn',             'LS',  'TINH'),
    ('Tỉnh Quảng Ninh',            'QN',  'TINH'),
    ('Tỉnh Thanh Hóa',             'TH',  'TINH'),
    ('Tỉnh Nghệ An',               'NA',  'TINH'),
    ('Tỉnh Hà Tĩnh',               'HT',  'TINH'),
    ('Tỉnh Cao Bằng',              'CB',  'TINH'),
    ('Tỉnh Tuyên Quang',           'TQ',  'TINH'),
    ('Tỉnh Lào Cai',               'LCA', 'TINH'),
    ('Tỉnh Thái Nguyên',           'TN',  'TINH'),
    ('Tỉnh Phú Thọ',               'PT',  'TINH'),
    ('Tỉnh Bắc Ninh',              'BN',  'TINH'),
    ('Tỉnh Hưng Yên',              'HY',  'TINH'),
    ('Tỉnh Ninh Bình',             'NB',  'TINH'),
    ('Tỉnh Quảng Trị',             'QT',  'TINH'),
    ('Tỉnh Quảng Ngãi',            'QNG', 'TINH'),
    ('Tỉnh Gia Lai',               'GL',  'TINH'),
    ('Tỉnh Khánh Hòa',             'KH',  'TINH'),
    ('Tỉnh Lâm Đồng',              'LD',  'TINH'),
    ('Tỉnh Đắk Lắk',               'DL',  'TINH'),
    ('Tỉnh Đồng Nai',              'DNA', 'TINH'),
    ('Tỉnh Tây Ninh',              'TNI', 'TINH'),
    ('Tỉnh Vĩnh Long',             'VL',  'TINH'),
    ('Tỉnh Đồng Tháp',             'DT',  'TINH'),
    ('Tỉnh Cà Mau',                'CM',  'TINH'),
    ('Tỉnh An Giang',              'AG',  'TINH')
) AS v(name, code, type)
CROSS JOIN (SELECT id FROM country WHERE code2 = 'VN' LIMIT 1) AS c
WHERE NOT EXISTS (
    SELECT 1 FROM state_or_province s
    WHERE s.name = v.name AND s.country_id = c.id
);
