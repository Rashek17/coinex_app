// factories/UsuarioRepositoryFactory.js
const UsuarioRepository = require("../repositories/UsuarioRepository");

class UsuarioRepositoryFactory {
  constructor(pool) {
    this.pool = pool;
  }

  create() {
    return new UsuarioRepository(this.pool);
  }
}

module.exports = UsuarioRepositoryFactory;
