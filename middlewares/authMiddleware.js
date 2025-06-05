const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 1. Récupère le token depuis le header Authorization
    const token = req.headers.authorization?.split(' ')[1]; // Format: "Bearer <token>"
    if (!token) throw new Error('Token manquant');

    // 2. Vérifie et décode le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Ajoute les infos utilisateur à la requête
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    res.status(401).json({
      error: 'Authentification échouée',
      details: error.message
    });
  }
};