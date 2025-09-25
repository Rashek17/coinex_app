// backend/db.js
const { Pool } = require("pg");
require("dotenv").config();

class Database {
  constructor() {
    if (!Database.instance) {
      this.pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
      });

      this.pool.connect()
        .then(() => console.log("✅ Conectado a PostgreSQL (singleton)"))
        .catch(err => console.error("❌ Error de conexión:", err));

      Database.instance = this;
    }

    return Database.instance;
  }

  // Método para consultar
  query(text, params) {
    return this.pool.query(text, params);
  }
}

const db = new Database();
Object.freeze(db); // evita modificaciones
module.exports = db;
