 Résultats des tests — TP3

| Test | Résultat attendu | Résultat obtenu |
|---|---|---|
| Afficher les produits | 200 | |
| Créer un produit valide | 201 | |
| Créer un produit invalide | 400 | |
| Modifier un produit existant | 200 | |
| Supprimer un produit existant | 204 | |
| Chercher un produit inexistant | 404 | |
| Demander la liste avec Redis arrêté | 200 et X-Cache: bypass | |

 Fonctionnement de la modification d’un produit (PUT)

La route PUT /api/produits/:id permet de modifier un produit.
Le contrôleur vérifie l’identifiant et les données reçues.
Si les données sont invalides, l’API renvoie 400.
Le modèle modifie le produit dans PostgreSQL : s’il est absent, l’API renvoie 404.
Si la modification réussit, on efface le cache et on renvoie le produit avec le code 200.

 Test avec Redis arrêté

J’ai arrêté Redis avec la commande docker compose stop redis.
J’ai ensuite demandé la liste avec GET /api/produits.
L’API a répondu 200 et a affiché les produits depuis PostgreSQL.
L’en-tête X-Cache indiquait bypass.
J’ai redémarré Redis avec docker compose start redis.

Conservation des données après un redémarrage

J’ai modifié le stock du produit Laptop pour mettre 6.
J’ai exécuté docker compose down, puis docker compose up -d.
Après le redémarrage, le stock du Laptop était toujours à 6.
Les données sont conservées grâce au volume PostgreSQL pgdata.