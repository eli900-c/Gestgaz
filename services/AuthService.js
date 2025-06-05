const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  static async register(nom, email, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ nom, email, passwordHash: hashedPassword, role });
    await user.save();
    return user;
  }

  static async login(email, password) {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error('Identifiants invalides');
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return { token, user };
  }

  static async getAllUsers() {
    return await User.find({}, '-passwordHash'); // Exclure le hash du mot de passe
  }

  static async updateUser(userId, updateData) {
    // Si password est à mettre à jour, le hasher
    if (updateData.password) {
      updateData.passwordHash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password; // Ne pas garder le mot de passe en clair
    }
    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, select: '-passwordHash' });
    if (!updatedUser) throw new Error('Utilisateur non trouvé');
    return updatedUser;
  }

  static async deleteUser(userId) {
    const result = await User.findByIdAndDelete(userId);
    if (!result) throw new Error('Utilisateur non trouvé');
    return;
  }
}

module.exports = AuthService;
