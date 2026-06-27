-- Seed quốc gia Việt Nam (idempotent)
INSERT INTO country (id, name, code2, code3,
                     is_billing_enabled, is_shipping_enabled,
                     is_city_enabled, is_zip_code_enabled, is_district_enabled)
SELECT 1, 'Việt Nam', 'VN', 'VNM', true, true, true, true, false
WHERE NOT EXISTS (
    SELECT 1 FROM country WHERE code2 = 'VN'
);
