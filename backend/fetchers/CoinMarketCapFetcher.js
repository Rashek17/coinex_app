const CryptoFetcher = require("./CryptoFetcher");
const fetch = require("node-fetch");

class CoinMarketCapFetcher extends CryptoFetcher {
  async fetch(symbol) {
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`,
      { headers: { "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY } }
    );
    return await response.json();
  }
}

module.exports = CoinMarketCapFetcher;
