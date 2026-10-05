import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export async function verifierConnexion(): Promise<boolean> {
    try {
        await pool.query("SELECT 1");
        return true;
    } catch (erreur) {
        console.error("Connexion PostgreSQL impossible :", erreur);
        return false;
    }
}