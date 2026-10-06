

 1. Quel est le rôle des routes, des contrôleurs et des modèles ?

La route indique quelle fonction appeler selon l’adresse demandée.
Le contrôleur vérifie les données et renvoie une réponse.
Le modèle communique avec la base de données.
Par exemple, pour afficher les produits, la route appelle le contrôleur.
Le contrôleur demande les produits au modèle, puis les renvoie au client.\

 2. Pourquoi faut-il convertir le prix en nombre ?

PostgreSQL peut renvoyer un prix de type NUMERIC sous forme de texte.
Par exemple, on reçoit "25.00" au lieu de 25.
On utilise Number() pour le convertir en nombre.
Le type number de TypeScript ne fait pas cette conversion automatiquement.

 3. Pourquoi utiliser unknown pour les données reçues ?

On ne sait pas si les données envoyées par le client sont correctes.
Le type unknown nous oblige à les vérifier avant de les utiliser.
Par exemple, on vérifie que le nom est du texte et que le prix est positif.
Si les données sont invalides, l’API renvoie une erreur 400.


 4. Comment fonctionne le cache Redis ?

L’API cherche d’abord les produits dans Redis.
S’ils sont absents, elle les récupère dans PostgreSQL et les garde dans Redis.
Le TTL de 60 secondes indique combien de temps les données restent en cache.
Quand on ajoute, modifie ou supprime un produit, on efface ce cache.
La prochaine demande récupère alors les données à jour.


 5. Quelle est la différence entre localhost et db ?

localhost désigne la machine sur laquelle le programme fonctionne.
Notre API lancée sur Windows utilise localhost et le port 15432.
Adminer fonctionne dans un conteneur et utilise db, le nom du service PostgreSQL.
Il se connecte au port 5432 à l’intérieur du réseau Docker.
Dans un conteneur, localhost désigne ce conteneur lui-même.


 6. Comment éviter les injections SQL ?

Une injection SQL consiste à envoyer du code SQL dans les données.
On utilise des paramètres comme $1 au lieu de coller les données dans la requête.
Par exemple : pool.query("SELECT * FROM produits WHERE id = $1", [id]).
La valeur de id est traitée comme une donnée et non comme du code SQL.


 7. Que se passe-t-il si Redis est arrêté ?

L’API continue de récupérer les produits dans PostgreSQL.
Elle renvoie X-Cache: bypass pour indiquer que le cache n’est pas utilisé.
On vérifie la connexion à Redis et on gère ses erreurs pour éviter de bloquer l’API.
Quand Redis redevient disponible, l’API peut utiliser le cache à nouveau.

 Bonus E2 — API dans Docker

 Pourquoi utiliser db au lieu de localhost ?
Dans le conteneur API, localhost désigne le conteneur API lui-même.
On utilise db pour joindre le conteneur PostgreSQL.

 Pourquoi utiliser une construction en plusieurs étapes ?
La première étape compile TypeScript en JavaScript.
L’image finale contient le JavaScript compilé et les dépendances nécessaires pour lancer l’API.

 Pourquoi mettre .env dans .dockerignore ?
Cela évite de copier les mots de passe et la configuration locale dans l’image Docker.

