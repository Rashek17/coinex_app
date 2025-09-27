const express = require("express");
const router = express.Router();

const CryptoFetcherFactory = require("../fetchers/CryptoFetcherFactory");
const historyFetcher = CryptoFetcherFactory.create("HISTORY");

// Endpoint historial OHLCV usando CoinGecko
router.get("/api/crypto/history/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const historial = await historyFetcher.getHistory(symbol);
    res.json(historial);
  } catch (error) {
    console.error("❌ Error cargando historial:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
