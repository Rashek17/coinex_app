const pool = require("../db");
const AnalisisRepository = require("../repositories/AnalisisRepository");

class AnalisisRepositoryFactory {
  static create() {
    return new AnalisisRepository(pool);
  }
}

module.exports = AnalisisRepositoryFactory;
