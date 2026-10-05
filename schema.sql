CREATE TABLE IF NOT EXISTS produits (
                                        id SERIAL PRIMARY KEY,
                                        nom TEXT NOT NULL,
                                        prix NUMERIC(10, 2) NOT NULL,
    stock INTEGER NOT NULL,
    categorie TEXT NOT NULL
    );

INSERT INTO produits (nom, prix, stock, categorie)
SELECT nom, prix, stock, categorie
FROM (
         VALUES
             ('Laptop', 1200.00, 5, 'Informatique'),
             ('Souris', 25.00, 50, 'Accessoires'),
             ('Clavier', 75.00, 30, 'Accessoires')
     ) AS initialisation(nom, prix, stock, categorie)
WHERE NOT EXISTS (
    SELECT 1 FROM produits
);