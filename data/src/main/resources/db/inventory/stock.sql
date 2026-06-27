INSERT INTO stock (product_id, quantity, reversed_quantity, warehouse_id)
SELECT
    p.id AS product_id,
    floor(random() * 100 + 10)::int AS quantity,
    floor(random() * 5)::int AS reversed_quantity,
    w.id AS warehouse_id
FROM
    generate_series(1, 20) AS p(id)
        CROSS JOIN
    (SELECT id FROM warehouse WHERE id IN (1, 2, 3)) AS w
WHERE NOT EXISTS (
    SELECT 1 FROM stock s
    WHERE s.product_id = p.id AND s.warehouse_id = w.id
);
