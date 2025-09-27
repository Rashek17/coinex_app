class PortafolioRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async obtenerPorUsuario(usuario_id) {
    if (!usuario_id) {
      throw new Error("Falta usuario_id");
    }

    const result = await this.pool.query(
      `SELECT activo, cantidad_total, valor_promedio, updated_at
       FROM portafolio
       WHERE id_usuario = $1`,
      [usuario_id]
    );

    return result.rows;
  }
}

module.exports = PortafolioRepository;
