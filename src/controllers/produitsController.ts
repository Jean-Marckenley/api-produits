import type { Request, Response } from "express";
import { validerProduit } from "../validation/produit.js";
import {
    obtenirProduits,
    obtenirProduitParId,
    creerProduit,
    modifierProduit,
    supprimerProduit
} from "../models/produit.js";
import { avecCache, purgerCache } from "../cache.js";

export async function listerProduits(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const resultat = await avecCache(
            "produits",
            obtenirProduits,
            60
        );

        res.setHeader("X-Cache", resultat.cache);
        res.status(200).json(resultat.valeur);
    } catch (erreur) {
        console.error(erreur);
        res.status(500).json({
            erreur: "Impossible de récupérer les produits"
        });
    }
}
export async function afficherProduit(
    req: Request,
    res: Response
): Promise<void> {
    const valeur = req.params.id;

    if (typeof valeur !== "string" || !/^[1-9]\d*$/.test(valeur)) {
        res.status(400).json({ erreur: "Identifiant invalide" });
        return;
    }

    const id = Number(valeur);

    if (!Number.isSafeInteger(id)) {
        res.status(400).json({ erreur: "Identifiant invalide" });
        return;
    }

    try {
        const produit = await obtenirProduitParId(id);

        if (!produit) {
            res.status(404).json({ erreur: "Produit introuvable" });
            return;
        }

        res.status(200).json(produit);
    } catch (erreur) {
        console.error(erreur);
        res.status(500).json({
            erreur: "Impossible de récupérer le produit"
        });
    }
}
export async function ajouterProduit(
    req: Request,
    res: Response
): Promise<void> {
    const validation = validerProduit(req.body);

    if (!validation.valide) {
        res.status(400).json({
            erreur: "Données invalides",
            details: validation.erreurs
        });
        return;
    }

    try {
        const produit = await creerProduit(validation.donnees);
        await purgerCache("produits");
        res.status(201).json(produit);
    } catch (erreur) {
        console.error(erreur);
        res.status(500).json({
            erreur: "Impossible de créer le produit"
        });
    }
}
export async function mettreAJourProduit(
    req: Request,
    res: Response
): Promise<void> {
    const valeur = req.params.id;

    if (typeof valeur !== "string" || !/^[1-9]\d*$/.test(valeur)) {
        res.status(400).json({ erreur: "Identifiant invalide" });
        return;
    }

    const id = Number(valeur);

    if (!Number.isSafeInteger(id)) {
        res.status(400).json({ erreur: "Identifiant invalide" });
        return;
    }

    const validation = validerProduit(req.body);

    if (!validation.valide) {
        res.status(400).json({
            erreur: "Données invalides",
            details: validation.erreurs
        });
        return;
    }

    try {
        const produit = await modifierProduit(id, validation.donnees);

        if (!produit) {
            res.status(404).json({ erreur: "Produit introuvable" });
            return;
        }
        await purgerCache("produits");
        res.status(200).json(produit);
    } catch (erreur) {
        console.error(erreur);
        res.status(500).json({
            erreur: "Impossible de modifier le produit"
        });
    }
}
export async function retirerProduit(
    req: Request,
    res: Response
): Promise<void> {
    const valeur = req.params.id;

    if (typeof valeur !== "string" || !/^[1-9]\d*$/.test(valeur)) {
        res.status(400).json({ erreur: "Identifiant invalide" });
        return;
    }

    const id = Number(valeur);

    if (!Number.isSafeInteger(id)) {
        res.status(400).json({ erreur: "Identifiant invalide" });
        return;
    }

    try {
        const supprime = await supprimerProduit(id);

        if (!supprime) {
            res.status(404).json({ erreur: "Produit introuvable" });
            return;
        }

        await purgerCache("produits");
        res.status(204).send();
    } catch (erreur) {
        console.error(erreur);
        res.status(500).json({
            erreur: "Impossible de supprimer le produit"
        });
    }
}