import "dotenv/config";
import { createClient } from "redis";

export const redis = createClient({
    url: process.env.REDIS_URL ?? "redis://localhost:6379",
    disableOfflineQueue: true
});

redis.on("error", (erreur) => {
    console.warn("Redis indisponible :", erreur.message);
});

export async function initialiserCache(): Promise<void> {
    try {
        await redis.connect();
        console.log("Connexion Redis réussie");
    } catch (erreur) {
        console.warn("Connexion Redis impossible :", erreur);
    }
}
export async function lireCache<T>(
    cle: string
): Promise<T | null> {
    const texte = await redis.get(cle);

    if (texte === null) {
        return null;
    }

    return JSON.parse(texte) as T;
}

export async function mettreEnCache<T>(
    cle: string,
    valeur: T,
    ttl: number = 60
): Promise<void> {
    await redis.set(cle, JSON.stringify(valeur), {
        EX: ttl
    });
}

export async function purgerCache(cle: string): Promise<void> {
    if (!redis.isReady) {
        return;
    }

    try {
        await redis.del(cle);
    } catch (erreur) {
        console.warn("Suppression du cache impossible :", erreur);
    }
}
export type SourceCache = "hit" | "miss" | "bypass";

export async function avecCache<T>(
    cle: string,
    charger: () => Promise<T>,
    ttl: number = 60
): Promise<{ valeur: T; cache: SourceCache }> {
    let cacheDisponible = redis.isReady;

    if (cacheDisponible) {
        try {
            const valeur = await lireCache<T>(cle);

            if (valeur !== null) {
                return { valeur, cache: "hit" };
            }
        } catch (erreur) {
            console.warn("Lecture du cache impossible :", erreur);
            cacheDisponible = false;
        }
    }

    const valeur = await charger();

    if (cacheDisponible) {
        try {
            await mettreEnCache(cle, valeur, ttl);
            return { valeur, cache: "miss" };
        } catch (erreur) {
            console.warn("Écriture du cache impossible :", erreur);
        }
    }

    return { valeur, cache: "bypass" };
}