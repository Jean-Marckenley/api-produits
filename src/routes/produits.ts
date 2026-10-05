import { Router } from "express";
import {
    listerProduits,
    afficherProduit,
    ajouterProduit,
    mettreAJourProduit,
    retirerProduit
} from "../controllers/produitsController.js";

const router = Router();

router.get("/", listerProduits);
router.get("/:id", afficherProduit);
router.post("/", ajouterProduit);
router.put("/:id", mettreAJourProduit);
router.delete("/:id", retirerProduit);

export default router;