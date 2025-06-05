const StockService = require('../services/StockService');

class StockController {
  // 🔁 Créer un stock
  static async createStock(req, res) {
    try {
      const { quantitePleine, quantiteVide, seuilAlerte } = req.body;
      const nouveauStock = await StockService.creerStock({
        quantitePleine,
        quantiteVide,
        seuilAlerte,
      });
      res.status(201).json(nouveauStock);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // 🔁 Lire un stock par ID
  static async getStock(req, res) {
  try {
    const stock = await StockService.getStock(); // sans req.params.id
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


  // 🔁 Mettre à jour un stock
  static async updateStock(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      const stock = await StockService.mettreAJourStock(id,data);
      res.json(stock);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // 🔁 Supprimer un stock
  static async deleteStock(req, res) {
    try {
      await StockService.supprimerStock(req.params.id);
      res.json({ message: 'Stock supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 🔁 Lire tous les stocks
  static async getAllStocks(req, res) {
    try {
      const stocks = await StockService.getAllStocks();
      res.json(stocks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = StockController;
