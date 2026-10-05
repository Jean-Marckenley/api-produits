import { pool } from "../db.js";

export interface Produit {
    id: number;
    nom: string;
    prix: number;
    stock: number;
    categorie: string;
}

export async function obtenirProduits(): Promise<Produit[]> {
    const resultat = await pool.query<{
        id: number;
        nom: string;
        prix: string;
        stock: number;
        categorie: string;
    }>(
        "SELECT id, nom, prix, stock, categorie FROM produits ORDER BY id"
    );

    return resultat.rows.map((ligne) => ({
        ...ligne,
        prix: Number(ligne.prix)
    }));
}
export async function obtenirProduitParId(
    id: number
): Promise<Produit | undefined> {
    const resultat = await pool.query<{
        id: number;
        nom: string;
        prix: string;
        stock: number;
        categorie: string;
    }>(
        `SELECT id, nom, prix, stock, categorie
         FROM produits
         WHERE id = $1`,
        [id]
    );

    const ligne = resultat.rows[0];

    if (!ligne) {
        return undefined;
    }

    return {
        ...ligne,
        prix: Number(ligne.prix)
    };
}
export type NouveauProduit = Omit<Produit, "id">;
export async function creerProduit(
    donnees: NouveauProduit
): Promise<Produit> {
    const resultat = await pool.query<{
        id: number;
        nom: string;
        prix: string;
        stock: number;
        categorie: string;
    }>(
        `INSERT INTO produits (nom, prix, stock, categorie)
         VALUES ($1, $2, $3, $4)
         RETURNING id, nom, prix, stock, categorie`,
        [
            donnees.nom,
            donnees.prix,
            donnees.stock,
            donnees.categorie
        ]
    );

    const ligne = resultat.rows[0];

    if (!ligne) {
        throw new Error("Le produit n’a pas été créé");
    }

    return {
        ...ligne,
        prix: Number(ligne.prix)
    };
}
export async function modifierProduit(
    id: number,
    donnees: NouveauProduit
): Promise<Produit | undefined> {
    const resultat = await pool.query<{
        id: number;
        nom: string;
        prix: string;
        stock: number;
        categorie: string;
    }>(
        `UPDATE produits
         SET nom = $1,
             prix = $2,
             stock = $3,
             categorie = $4
         WHERE id = $5
         RETURNING id, nom, prix, stock, categorie`,
        [
            donnees.nom,
            donnees.prix,
            donnees.stock,
            donnees.categorie,
            id
        ]
    );

    const ligne = resultat.rows[0];

    if (!ligne) {
        return undefined;
    }

    return {
        ...ligne,
        prix: Number(ligne.prix)
    };
}
export async function supprimerProduit(id: number): Promise<boolean> {
    const resultat = await pool.query(
        "DELETE FROM produits WHERE id = $1",
        [id]
    );

    return (resultat.rowCount ?? 0) > 0;
}