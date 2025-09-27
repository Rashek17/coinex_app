const pool = require("../db");
const PortafolioRepository = require("../repositories/PortafolioRepository");

class PortafolioRepositoryFactory {
  static create() {
    return new PortafolioRepository(pool);
  }
}

module.exports = PortafolioRepositoryFactory;
