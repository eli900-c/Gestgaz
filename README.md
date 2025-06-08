# GestGaz – API de gestion de stock de gaz

## Fonctionnalité principale

Cette API permet de gérer le stock de bouteilles de gaz :  
- Suivi des quantités pleines et vides  
- Gestion du seuil d’alerte  
- Création, mise à jour et suppression de stocks  
- Suivi des mouvements de bouteilles

---

## Prérequis

- **Node.js** (v18 ou supérieur recommandé)
- **MongoDB** (local ou distant)
- Un compte GitHub (pour cloner le projet)

---

## Installation et lancement

1. **Cloner le projet**
   ```bash
   git clone https://github.com/eli900-c/Gestgaz.git
   cd Gestgaz

2. Installation des dépendances
   ```bash
    npm install


3.Configurer les variables d’environnement 

Crée un fichier .env à la racine :
   ```bash
   MONGODB_URI=ton_url_m  PORT=3000 JWT_SECRET=une_chaine_secrete
   ```

4.Lancer le server  
```bash
node server.js
```


Principales routes de l’API

Méthode	Endpoint	Description :

GET	/api/stock	Récupérer le stock actuel
POST	/api/stock	Créer un nouveau stock
PUT	/api/stock/:id	Mettre à jour un stock
DELETE	/api/stock/:id	Supprimer un stock


Exemple d’utilisation
Créer un stock

```bash
POST /api/stock
Content-Type: application/json

{
  "quantitePleine": 10,
  "quantiteVide": 5,
  "seuilAlerte": 3
}
```

Réponse
````
{
  "_id": "xxx",
  "quantitePleine": 10,
  "quantiteVide": 5,
  "seuilAlerte": 3
}
````








   

