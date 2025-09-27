// backend/middlewares/authMiddleware.js
function authMiddleware(req, res, next) {
  if (!req.session.usuarioId) {
    return res.status(401).json({ error: "No autorizado 🚫" });
  }
  next();
}

module.exports = authMiddleware;
