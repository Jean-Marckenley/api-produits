import type { NouveauProduit } from "../models/produit.js";

type ResultatValidation =
    | { valide: true; donnees: NouveauProduit }
    | { valide: false; erreurs: string[] };

export function validerProduit(
    body: unknown
): ResultatValidation {
    if (
        typeof body !== "object" ||
        body === null ||
        Array.isArray(body)
    ) {
        return {
            valide: false,
            erreurs: ["Le corps doit être un objet"]
        };
    }

    const donnees = body as Record<string, unknown>;

    const nom = donnees.nom;
    const prix = donnees.prix;
    const stock = donnees.stock;
    const categorie = donnees.categorie;

    if (
        typeof nom === "string" &&
        nom.trim().length > 0 &&
        typeof prix === "number" &&
        Number.isFinite(prix) &&
        prix > 0 &&
        typeof stock === "number" &&
        Number.isInteger(stock) &&
        stock >= 0 &&
        typeof categorie === "string" &&
        categorie.trim().length > 0
    ) {
        return {
            valide: true,
            donnees: {
                nom: nom.trim(),
                prix,
                stock,
                categorie: categorie.trim()
            }
        };
    }

    const erreurs: string[] = [];

    if (typeof nom !== "string" || nom.trim().length === 0) {
        erreurs.push("Le nom est obligatoire");
    }

    if (
        typeof prix !== "number" ||
        !Number.isFinite(prix) ||
        prix <= 0
    ) {
        erreurs.push("Le prix doit être un nombre supérieur à zéro");
    }

    if (
        typeof stock !== "number" ||
        !Number.isInteger(stock) ||
        stock < 0
    ) {
        erreurs.push("Le stock doit être un entier positif ou zéro");
    }

    if (
        typeof categorie !== "string" ||
        categorie.trim().length === 0
    ) {
        erreurs.push("La catégorie est obligatoire");
    }

    return { valide: false, erreurs };
}