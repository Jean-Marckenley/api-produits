import "dotenv/config";
import express from "express";
import cors from "cors";

import produitsRouter from "./routes/produits.js";
import { verifierConnexion } from "./db.js";
import { initialiserCache } from "./cache.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get("/api/health", async (_req, res) => {
    const connexionOK = await verifierConnexion();

    if (connexionOK) {
        res.status(200).json({ statut: "ok" });
    } else {
        res.status(503).json({ statut: "erreur" });
    }
});

app.use("/api/produits", produitsRouter);


void initialiserCache();
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});