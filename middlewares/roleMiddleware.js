// Version flexible pour vérifier un ou plusieurs rôles
module.exports = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Accès refusé',
        requiredRoles: roles,
        yourRole: req.user.role
      });
    }
    next();
  };
};

// Exemple d'utilisation :
// router.patch('/validate', roleMiddleware(['admin', 'controleur']), ...);