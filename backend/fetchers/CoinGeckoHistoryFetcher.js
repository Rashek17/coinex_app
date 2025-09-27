const fetch = require("node-fetch");

class CoinGeckoHistoryFetcher {
  constructor() {
    this.coinMap = {
      ETH: "ethereum",
      LTC: "litecoin",
      BTC: "bitcoin"
    };
  }

  async getHistory(symbol) {
    const coinId = this.coinMap[symbol.toUpperCase()];
    if (!coinId) {
      throw new Error("Criptomoneda no soportada");
    }

    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.prices) {
      throw new Error("No se obtuvieron datos de CoinGecko");
    }

    // Convertir al formato OHLC simplificado
    return data.prices.map(p => {
      const timestamp = p[0];
      const close = p[1];
      return {
        timestamp,
        open: close,
        high: close,
        low: close,
        close
      };
    });
  }
}

module.exports = CoinGeckoHistoryFetcher;
