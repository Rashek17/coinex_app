const express = require("express");
const router = express.Router();
const CryptoFetcherFactory = require("../fetchers/CryptoFetcherFactory");

router.get("/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const fetcher = CryptoFetcherFactory.create("CMC"); // Fuente de datos
    const data = await fetcher.fetch(symbol);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
