const CoinGeckoHistoryFetcher = require("./CoinGeckoHistoryFetcher");

class CryptoFetcherFactory {
  static create(type = "history") {
    switch (type) {
      case "history":
        return new CoinGeckoHistoryFetcher();
      default:
        throw new Error("Tipo de fetcher no soportado");
    }
  }
}

module.exports = CryptoFetcherFactory;
