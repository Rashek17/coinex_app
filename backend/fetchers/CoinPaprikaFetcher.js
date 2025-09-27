const axios = require("axios");

class CoinPaprikaFetcher {
  async fetchTop(n = 5) {
    try {
      const response = await axios.get("https://api.coinpaprika.com/v1/tickers");
      return response.data.slice(0, n);
    } catch (error) {
      console.error("Error en CoinPaprikaFetcher:", error.message);
      throw new Error("Error al obtener datos de CoinPaprika");
    }
  }
}

module.exports = CoinPaprikaFetcher;
