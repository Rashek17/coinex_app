const CoinMarketCapFetcher = require("./CoinMarketCapFetcher");
const MockCryptoFetcher = require("./MockCryptoFetcher");
const CoinGeckoHistoryFetcher = require("./CoinGeckoHistoryFetcher"); 

class CryptoFetcherFactory {
  static create(type) {
    switch(type) {
      case "CMC": 
        return new CoinMarketCapFetcher();
      case "MOCK": 
        return new MockCryptoFetcher();
      case "HISTORY": 
        return new CoinGeckoHistoryFetcher();
      default: 
        throw new Error(`Tipo de fetcher no soportado: ${type}`);
    }
  }
}

module.exports = CryptoFetcherFactory;
