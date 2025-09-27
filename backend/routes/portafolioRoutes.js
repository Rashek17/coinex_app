const express = require("express");
const router = express.Router();
const PortafolioRepositoryFactory = require("../factories/PortafolioRepositoryFactory");

const portafolioRepo = PortafolioRepositoryFactory.create();

// Obtener el portafolio de un usuario
router.get("/", async (req, res) => {
  try {
    const { usuario_id } = req.query;
    const portafolio = await portafolioRepo.obtenerPorUsuario(usuario_id);

    res.json({
      success: true,
      portafolio
    });
  } catch (err) {
    console.error("Error obteniendo portafolio:", err.message);
    res.status(400).json({
      success: false,
      error: err.message || "Error interno del servidor"
    });
  }
});

module.exports = router;
