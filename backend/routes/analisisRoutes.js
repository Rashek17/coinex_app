const express = require("express");
const router = express.Router();

const AnalisisRepositoryFactory = require("../factories/AnalisisRepositoryFactory");
const analisisRepository = AnalisisRepositoryFactory.create();

router.post("/api/analizar-portafolio", async (req, res) => {
  try {
    const { usuarioId } = req.body;

    const portafolio = await analisisRepository.obtenerPortafolio(usuarioId);
    if (portafolio.length === 0) {
      return res.json({
        usuarioId,
        rendimiento: [],
        analisis: "El usuario no tiene activos en su portafolio."
      });
    }

    // Lista de símbolos
    const symbols = portafolio.map(p => p.activo).join(",");

    // Precios actuales
    const data = await analisisRepository.obtenerPreciosCoinMarketCap(symbols);
    const preciosActuales = {};
    for (let p of portafolio) {
      if (data.data[p.activo]) {
        preciosActuales[p.activo] = data.data[p.activo].quote.USD.price;
      }
    }

    // Rendimiento
    const rendimiento = analisisRepository.calcularRendimiento(portafolio, preciosActuales);

    // IA
    const analisis = await analisisRepository.pedirAnalisisIA(rendimiento);

    res.json({ usuarioId, rendimiento, analisis });

  } catch (error) {
    console.error("❌ Error en análisis con IA:", error.message || error);
    res.status(500).json({ error: "Error al analizar portafolio con IA" });
  }
});

module.exports = router;
