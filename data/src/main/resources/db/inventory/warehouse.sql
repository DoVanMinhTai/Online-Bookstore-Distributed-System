INSERT INTO warehouse (name, address_id)
SELECT v.name, v.address_id
FROM (VALUES
    ('Kho Miền Bắc - Hà Nội', 101),
    ('Kho Miền Nam - TP.HCM', 102),
    ('Kho Miền Trung - Đà Nẵng', 103)
) AS v(name, address_id)
WHERE NOT EXISTS (
    SELECT 1 FROM warehouse w WHERE w.name = v.name
);
