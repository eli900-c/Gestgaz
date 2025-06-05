const AuthService = require('../services/AuthService');

class AuthController {
  static async register(req, res) {
    try {
      const { nom, email, password, role } = req.body;
      const user = await AuthService.register(nom, email, password, role);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login(email, password);
      res.json({ token, user });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Ajout des méthodes manquantes pour le userRoute.js
  static async getAllUsers(req, res) {
    try {
      const users = await AuthService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const updateData = req.body;
      const updatedUser = await AuthService.updateUser(userId, updateData);
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      await AuthService.deleteUser(userId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
