const CoinMarketCapFetcher = require("./CoinMarketCapFetcher");
const MockCryptoFetcher = require("./MockCryptoFetcher");

class CryptoFetcherFactory {
  static create(type) {
    switch(type) {
      case "CMC": return new CoinMarketCapFetcher();
      case "MOCK": return new MockCryptoFetcher();
      default: throw new Error("Tipo de fetcher no soportado");
    }
  }
}

module.exports = CryptoFetcherFactory;
