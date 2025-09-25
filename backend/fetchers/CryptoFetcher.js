class CryptoFetcher {
  async fetch(symbol) {
    throw new Error("Debe implementarse en la subclase");
  }
}

module.exports = CryptoFetcher;
