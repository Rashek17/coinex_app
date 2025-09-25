const CryptoFetcher = require("./CryptoFetcher");

class MockCryptoFetcher extends CryptoFetcher {
  async fetch(symbol) {
    return { symbol, price: 123.45, source: "mock" };
  }
}

module.exports = MockCryptoFetcher;
