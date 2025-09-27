const CoinMarketCapFetcher = require("./CoinMarketCapFetcher");
const MockCryptoFetcher = require("./MockCryptoFetcher");
const CoinGeckoHistoryFetcher = require("./CoinGeckoHistoryFetcher");
const CoinPaprikaFetcher = require("./CoinPaprikaFetcher");

class CryptoFetcherFactory {
  static create(type) {
    switch(type) {
      case "CMC": 
        return new CoinMarketCapFetcher();
      case "MOCK": 
        return new MockCryptoFetcher();
      case "HISTORY": 
        return new CoinGeckoHistoryFetcher();
      case "COINPAPRIKA":
        return new CoinPaprikaFetcher();
      default: 
        throw new Error(`Tipo de fetcher no soportado: ${type}`);
    }
  }
}

module.exports = CryptoFetcherFactory;
