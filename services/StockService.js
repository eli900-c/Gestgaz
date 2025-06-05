const Stock = require('../models/Stock');
const Bouteille = require('../models/Bouteille');
const { v4: uuidv4 } = require('uuid');

class StockService {
  // Créer un stock unique + création des bouteilles associées
  static async creerStock(data) {
    const existant = await Stock.findOne();
    if (existant) {
      throw new Error("Un stock existe déjà.");
    }

    const quantitePleine = Number(data.quantitePleine) || 0;
    const quantiteVide = Number(data.quantiteVide) || 0;
    const seuilAlerte = Number(data.seuilAlerte) || 10;

    // Création du stock
    const nouveauStock = await Stock.create({ quantitePleine, quantiteVide, seuilAlerte });

    // Création des bouteilles pleines
    const bouteillesPleines = [];
    for (let i = 0; i < quantitePleine; i++) {
      bouteillesPleines.push({
        stockId: nouveauStock._id,
        typeGaz: 'butane',
        capaciteKg: 12,
        prixConsigne: 2000,
        prixVente: 9000,
        etat: 'pleine',
        codeBarre: `BP-${uuidv4()}`
      });
    }

    // Création des bouteilles vides
    const bouteillesVides = [];
    for (let i = 0; i < quantiteVide; i++) {
      bouteillesVides.push({
        stockId: nouveauStock._id,
        typeGaz: 'butane',
        capaciteKg: 12,
        prixConsigne: 2000,
        prixVente: 0,
        etat: 'vide',
        codeBarre: `BV-${uuidv4()}`
      });
    }

    // Insertion en base de toutes les bouteilles
    await Bouteille.insertMany([...bouteillesPleines, ...bouteillesVides]);

    return nouveauStock;
  }

  // Lire le stock (unique)
  static async getStock() {
    const stock = await Stock.findOne();
    if (!stock) throw new Error("Aucun stock trouvé.");
    return stock;
  }


  static async getAllStocks() {
    const stocks = await Stock.find();
    if (stocks.length === 0) throw new Error("Aucun stock trouvé.");
    return stocks;
  }

  // Mettre à jour les quantités (ajouter)
 static async mettreAJourStock(id, data) {
  const stock = await Stock.findById(id);
  if (!stock) throw new Error("Stock introuvable");

  // On remplace les valeurs existantes
  stock.quantitePleine = Number(data.quantitePleine) || 0;
  stock.quantiteVide = Number(data.quantiteVide) || 0;
  stock.seuilAlerte = Number(data.seuilAlerte) || 10;

  // Vérifier le seuil APRÈS la mise à jour
   let alerte = null;
   if (stock.quantitePleine < stock.seuilAlerte) {
      console.warn("⚠️ Stock de bouteilles pleines sous le seuil d'alerte !");
     alerte = "⚠️ Stock de bouteilles pleines sous le seuil d'alerte !";
   }


  await stock.save();
  return alerte ? { stock, alerte } : stock;
}




static async supprimerStock(id) {
  const stock = await Stock.findById(id);
  if (!stock) throw new Error("Stock introuvable ou déjà supprimé");
  // Supprimer les bouteilles associées à ce stock
  await Bouteille.deleteMany({ stockId: id });
  // Supprimer le stock
  await Stock.findByIdAndDelete(id);
  return { message: "Stock et bouteilles associées supprimés avec succès" };
}

// Méthode pour ajuster le stock global (pleines ou vides)
static async ajusterStockGlobal({ quantite, type }) {
  // type = 'pleine' ou 'vide'
  const stock = await Stock.findOne();
  if (!stock) throw new Error("Aucun stock trouvé.");

  if (type === 'pleine') {
    stock.quantitePleine += quantite;
    if (stock.quantitePleine < 0) throw new Error("Stock de bouteilles pleines insuffisant !");
  } else if (type === 'vide') {
    stock.quantiteVide += quantite;
    if (stock.quantiteVide < 0) throw new Error("Stock de bouteilles vides insuffisant !");
  } else {
    throw new Error("Type de bouteille inconnu.");
  }

  await stock.save();
  return stock;
}
}

module.exports = StockService;
