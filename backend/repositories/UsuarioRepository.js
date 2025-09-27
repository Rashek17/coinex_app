// repositories/UsuarioRepository.js
const bcrypt = require("bcryptjs");

class UsuarioRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async login(email, password) {
  const result = await this.pool.query(
    "SELECT * FROM usuarios WHERE correo_electronico = $1",
    [email]
  );

  if (result.rows.length === 0) return null;

  const usuario = result.rows[0];
  const validPassword = await bcrypt.compare(password, usuario.contrasena);

  if (!validPassword) return false; // contraseña incorrecta

  return {
    id: usuario.id_usuario,
    nombre: usuario.nombres,
    email: usuario.correo_electronico,
    rol: usuario.id_rol === 1 ? "Administrador" : "Usuario"
  };
}


  async crear(datos) {
    const {
      id_rol,
      nombres,
      apellidos,
      direccion,
      direccion2,
      empresa,
      pais,
      ciudad,
      codigo_postal,
      telefono1,
      telefono2,
      correo_electronico,
      url_facebook,
      url_twitter,
      url_instagram,
      url_linkedin,
      username,
      contrasena,
      estado_activo
    } = datos;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    const query = `
      INSERT INTO usuarios (
        id_rol, nombres, apellidos, direccion1, direccion2, nombre_empresa, pais, ciudad, codigo_postal,
        telefono_movil, contacto_alterno, correo_electronico, facebook_url, twitter_url, instagram_url, linkedin_url,
        nombre_usuario, contrasena, habilitar_doble_autenticacion, fecha_creacion
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,
        $10,$11,$12,$13,$14,$15,$16,
        $17,$18,$19,NOW()
      ) RETURNING *
    `;

    const result = await this.pool.query(query, [
      id_rol, nombres, apellidos, direccion, direccion2 || null, empresa || null,
      pais, ciudad, codigo_postal, telefono1, telefono2 || null,
      correo_electronico, url_facebook || null, url_twitter || null,
      url_instagram || null, url_linkedin || null, username,
      hashedPassword, estado_activo ?? true,
    ]);

    return result.rows[0];
  }

  async obtenerPorId(id) {
    const result = await this.pool.query(
      "SELECT * FROM usuarios WHERE id_usuario = $1",
      [id]
    );
    return result.rows[0] || null;
  }

async listar() {
  const result = await this.pool.query(`
    SELECT 
      id_usuario,
      id_rol,
      nombres,
      apellidos,
      direccion1,
      direccion2,
      nombre_empresa,
      pais,
      ciudad,
      codigo_postal,
      telefono_movil,
      contacto_alterno,
      correo_electronico,
      facebook_url,
      twitter_url,
      instagram_url,
      linkedin_url,
      nombre_usuario,
      contrasena,
      habilitar_doble_autenticacion,
      fecha_creacion
    FROM usuarios
  `);

  // Mapeamos id_rol → nombre del rol
  return result.rows.map(u => ({
    ...u,
    rol: u.id_rol === 1 ? "Administrador" : "Usuario"
  }));
}



  async eliminar(id) {
    const result = await this.pool.query(
      "DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *",
      [id]
    );
    return result.rows[0] || null;
  }

  async actualizar(id, datos) {
    const {
      id_rol,
      nombres,
      apellidos,
      direccion,
      direccion2,
      empresa,
      pais,
      ciudad,
      codigo_postal,
      telefono1,
      telefono2,
      correo_electronico,
      url_facebook,
      url_twitter,
      url_instagram,
      url_linkedin,
      username,
      contrasena,
      estado_activo
    } = datos;

    let hashedPassword = null;
    if (contrasena) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(contrasena, salt);
    }

    const query = `
      UPDATE usuarios SET
        id_rol = $1, nombres = $2, apellidos = $3, direccion1 = $4, direccion2 = $5,
        nombre_empresa = $6, pais = $7, ciudad = $8, codigo_postal = $9,
        telefono_movil = $10, contacto_alterno = $11, correo_electronico = $12,
        facebook_url = $13, twitter_url = $14, instagram_url = $15, linkedin_url = $16,
        nombre_usuario = $17,
        contrasena = COALESCE($18, contrasena),
        habilitar_doble_autenticacion = $19,
        fecha_creacion = NOW()
      WHERE id_usuario = $20
      RETURNING *
    `;

    const result = await this.pool.query(query, [
      id_rol, nombres, apellidos, direccion, direccion2 || null, empresa || null,
      pais, ciudad, codigo_postal, telefono1, telefono2 || null,
      correo_electronico, url_facebook || null, url_twitter || null,
      url_instagram || null, url_linkedin || null, username,
      hashedPassword, estado_activo ?? true, id
    ]);

    return result.rows[0] || null;
  }
  async listarSelectAll() {
    const result = await this.pool.query(`
      SELECT 
        id_usuario, 
        nombres AS nombre, 
        apellidos AS apellido 
      FROM usuarios
    `);

    return result.rows;
  }
  
}

module.exports = UsuarioRepository;