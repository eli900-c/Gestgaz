const bcrypt = require('bcrypt');
const User = require('../models/User');

class UserController {
  // 🔁 Créer un utilisateur (par un admin)
  static async createUser(req, res) {
    const { nom, email, password, role } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Cet utilisateur existe déjà' });
      }

      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Utilise passwordHash pour correspondre au schéma
      const nouvelUtilisateur = new User({ nom, email, passwordHash: hashedPassword, role });
      await nouvelUtilisateur.save();
      res.status(201).json(nouvelUtilisateur);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 🔁 Lire tous les utilisateurs
  static async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 🔁 Lire un utilisateur par ID
  static async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 🔁 Modifier un utilisateur
  static async updateUser(req, res) {
    try {
      const { nom, email, role } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { nom, email, role },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 🔁 Supprimer un utilisateur
  static async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;
