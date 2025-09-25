// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");
const bcrypt = require("bcrypt");
const axios = require("axios");
const cryptoRoutes = require("./routes/cryptoRoutes");


const {
  OpenAI
} = require("openai");
const {
  GPT4All
} = require('gpt4all');
const path = require('path');
const ollama = require("ollama");

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba para ver que el server funciona
app.get("/", (req, res) => {
  res.send("Servidor funcionando ✅");
});

// Ruta de login
app.post("/login", async (req, res) => {
  const {
    email,
    password
  } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE correo_electronico = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "Usuario no encontrado"
      });
    }

    const usuario = result.rows[0];

    const validPassword = await bcrypt.compare(password, usuario.contrasena);

    if (!validPassword) {
      return res.status(401).json({
        error: "Contraseña incorrecta"
      });
    }

    res.json({
      message: "Login exitoso ✅",
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombres,
        email: usuario.correo_electronico,
        rol: usuario.id_rol,
      },
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({
      error: "Error en el servidor 🚨"
    });
  }
});

//  Eliminar usuario por ID
app.delete("/usuarios-eliminar/:id", async (req, res) => {
  const {
    id
  } = req.params;

  try {
    const result = await pool.query("DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    res.json({
      mensaje: "Usuario eliminado correctamente",
      usuario: result.rows[0]
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});


// Ruta para registrar usuario
app.post("/usuarios", async (req, res) => {
  try {
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
      estado_activo,
    } = req.body;

    console.log("Datos de registro:", req.body);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    const result = await pool.query(
      `INSERT INTO usuarios (
        id_rol, nombres, apellidos, direccion1, direccion2, nombre_empresa, pais, ciudad, codigo_postal,
        telefono_movil, contacto_alterno, correo_electronico, facebook_url, twitter_url, instagram_url, linkedin_url,
        nombre_usuario, contrasena, habilitar_doble_autenticacion, fecha_creacion
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, NOW()
      ) RETURNING *`,
      [
        id_rol,
        nombres,
        apellidos,
        direccion,
        direccion2 || null,
        empresa || null,
        pais,
        ciudad,
        codigo_postal,
        telefono1,
        telefono2 || null,
        correo_electronico,
        url_facebook || null,
        url_twitter || null,
        url_instagram || null,
        url_linkedin || null,
        username,
        hashedPassword,
        estado_activo ?? true,
      ]
    );



    res.status(201).json({
      message: "Usuario creado con éxito ✅",
      usuario: result.rows[0],
    });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({
      error: "Error en el servidor 🚨"
    });
  }
});


// Ruta para actualizar usuario
app.put("/usuarios-actualizar/:id", async (req, res) => {
  try {
    const {
      id
    } = req.params;

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
      contrasena, // opcional (si no lo envías, no se actualiza)
      estado_activo,
    } = req.body;

    let hashedPassword = null;
    if (contrasena) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(contrasena, salt);
    }

    const result = await pool.query(
      `UPDATE usuarios SET
        id_rol = $1,
        nombres = $2,
        apellidos = $3,
        direccion1 = $4,
        direccion2 = $5,
        nombre_empresa = $6,
        pais = $7,
        ciudad = $8,
        codigo_postal = $9,
        telefono_movil = $10,
        contacto_alterno = $11,
        correo_electronico = $12,
        facebook_url = $13,
        twitter_url = $14,
        instagram_url = $15,
        linkedin_url = $16,
        nombre_usuario = $17,
        contrasena = COALESCE($18, contrasena),
        habilitar_doble_autenticacion = $19,
        fecha_creacion = NOW()
      WHERE id_usuario = $20
      RETURNING *`,
      [
        id_rol,
        nombres,
        apellidos,
        direccion,
        direccion2 || null,
        empresa || null,
        pais,
        ciudad,
        codigo_postal,
        telefono1,
        telefono2 || null,
        correo_electronico,
        url_facebook || null,
        url_twitter || null,
        url_instagram || null,
        url_linkedin || null,
        username,
        hashedPassword, // si no hay contraseña nueva → COALESCE mantiene la actual
        estado_activo ?? true,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado 🚫"
      });
    }

    res.json({
      message: "Usuario actualizado con éxito ✨",
      usuario: result.rows[0],
    });
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    res.status(500).json({
      error: "Error en el servidor 🚨"
    });
  }
});


// Obtener transacciones por usuario
app.get("/transacciones/:idUsuario", async (req, res) => {
  try {
    const {
      idUsuario
    } = req.params;

    const result = await pool.query(
      `SELECT id_transaccion, id_usuario, activo, tipo, cantidad, precio_unitario, fecha
       FROM transacciones
       WHERE id_usuario = $1
       ORDER BY fecha DESC`,
      [idUsuario]
    );

    if (result.rows.length === 0) {
      return res.json({
        mensaje: "No hay transacciones para este usuario"
      });
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener transacciones:", err);
    res.status(500).json({
      error: "Error en el servidor 🚨"
    });
  }
});


// Ruta para obtener usuarios
app.get("/usuarios-select", async (req, res) => {
  try {
    const result = await pool.query("SELECT id_usuario, nombres AS nombre, apellidos AS apellido FROM usuarios");
    res.json(result.rows); // devuelve un array [{id:1, nombre:"Carlos", apellido:"Pérez"}, ...]
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: "Error al obtener usuarios"
    });
  }
});

app.get("/usuarios/:id", async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const result = await pool.query("SELECT * FROM usuarios WHERE id_usuario = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    res.status(500).json({
      error: "Error obteniendo usuario"
    });
  }
});


app.get("/todos-usuarios", async (req, res) => {
  const sql = `
    SELECT 
      id_rol, nombres, apellidos, direccion1, direccion2, nombre_empresa, pais, ciudad, 
      codigo_postal, telefono_movil, contacto_alterno, correo_electronico, 
      facebook_url, twitter_url, instagram_url, linkedin_url, 
      nombre_usuario, contrasena, habilitar_doble_autenticacion, fecha_creacion
    FROM usuarios
  `;

  try {
    const results = await pool.query(sql);

    // results.rows contiene los registros
    const data = results.rows.map(u => ({
      ...u,
      rol: u.id_rol === 1 ? "Administrador" : "Usuario",
    }));

    res.json(data);
  } catch (err) {
    console.error("Error en la consulta:", err);
    res.status(500).json({
      error: "Error al obtener usuarios"
    });
  }
});


// ===============================
// 🔥 Nueva ruta: Precios de criptos con CoinMarketCap
// ===============================
// Usamos rutas separadas para mantener el código organizado - con method factory
app.use("/api/crypto", cryptoRoutes);

// Endpoint historial OHLCV usando CoinGecko
app.get("/api/crypto/history/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toLowerCase(); // CoinGecko usa minúsculas

    // CoinGecko requiere el ID de la moneda, no el símbolo
    // Puedes crear un pequeño map si quieres soportar ETH, LTC, BTC
    const coinMap = {
      ETH: "ethereum",
      LTC: "litecoin",
      BTC: "bitcoin"
    };

    const coinId = coinMap[symbol.toUpperCase()];
    if (!coinId) {
      return res.status(400).json({
        error: "Criptomoneda no soportada"
      });
    }

    // Endpoint CoinGecko para historial 1 año
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.prices) {
      return res.status(500).json({
        error: "No se obtuvieron datos de CoinGecko"
      });
    }

    // Transformar datos al formato que ApexCharts candlestick necesita
    // CoinGecko devuelve arrays: [timestamp, precio]
    const historial = data.prices.map((p, i) => {
      const timestamp = p[0];
      const close = p[1];

      // Para OHLC simple aproximamos open, high, low, close usando precio diario
      // CoinGecko tiene endpoint más avanzado para OHLC pero requiere intervalos
      // Aquí simplificamos para gráfico
      return {
        timestamp,
        open: close,
        high: close,
        low: close,
        close
      };
    });

    res.json(historial);

  } catch (error) {
    console.error("Error cargando historial:", error);
    res.status(500).json({
      error: error.message
    });
  }
});


app.get("/api/crypto/bitcoin", async (req, res) => {
  try {
    const response = await fetch(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/historical?symbol=BTC&interval=daily&count=30", {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY,
          "Accept": "application/json"
        }
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error al obtener datos de CoinMarketCap"
    });
  }
});

/// Endpoint para historial tipo "History" del frontend usando CoinGecko
app.get("/api/crypto/historyCard/:symbol", async (req, res) => {
  try {
    const symbolMap = {
      BTC: "bitcoin",
      ETH: "ethereum",
      LTC: "litecoin",
      XMR: "monero"
    };

    const symbol = req.params.symbol.toUpperCase();
    const coinId = symbolMap[symbol];

    if (!coinId) return res.status(400).json({
      error: "Símbolo no soportado"
    });

    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=5`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error en CoinGecko: ${response.status}`);

    const data = await response.json();

    // Mapear los precios y limitar a los últimos 5 elementos
    const history = data.prices.map((item, index, arr) => {
      const date = new Date(item[0]);
      const price = item[1];
      let priceChange = "+0.00";
      let priceChangeType = "success";

      if (index > 0) {
        const prev = arr[index - 1][1];
        const change = price - prev;
        priceChange = `${change >= 0 ? "+" : ""}${change.toFixed(2)}`;
        priceChangeType = change >= 0 ? "success" : "danger";
      }

      return {
        img: coinId === "bitcoin" ? "01.png" : coinId === "ethereum" ? "09.png" : "06.png",
        name: symbol === "BTC" ? "Bitcoin" : symbol === "ETH" ? "Ethereum" : "Litecoin",
        priceChange,
        description: symbol === "BTC" ?
          "Bitcoins Evolution™. 234000 Satisfied Customers From 107 Countries." : symbol === "ETH" ?
          "Ethereum is a decentralized, blockchain with smart contract functionality" : "Litecoin is a peer-to-peer cryptocurrency and open-source software",
        date: date.toLocaleDateString()
      };
    }).slice(-3); // Limitar solo a los últimos 5 elementos

    res.json(history);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});

app.get("/api/data/dataTable", async (req, res) => {
  try {
    const response = await axios.get("https://api.coinpaprika.com/v1/tickers");
    // solo los primeros 5
    const top5 = response.data.slice(0, 5);

    res.json(top5);
  } catch (error) {
    console.error("Error en CoinPaprika:", error.message);
    res.status(500).json({
      error: "Error al obtener datos de CoinPaprika"
    });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const {
      message
    } = req.body;
    console.log("👉 Mensaje recibido:", message);

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-r1:1.5b",
        stream: false,
        messages: [{
            role: "system",
            content: `
Eres un experto en criptomonedas. 
Responde siempre en español, de manera clara, concisa y didáctica. 
No uses bloques <think>, ni inglés, ni otros idiomas. SIEMPRE responde en español.
Puedes saludar y responder preguntas generales, pero dirige siempre la conversación hacia criptomonedas y finanzas digitales.

`
          },
          {
            role: "user",
            content: message
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("👉 Respuesta cruda de Ollama:", JSON.stringify(data, null, 2));

    // obtengo la respuesta del modelo
    let reply = data.message?.content || "No se pudo interpretar la respuesta";

    // 🧹 limpiar cualquier bloque <think> o texto raro
    reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, "");
    reply = reply.replace(/[\x00-\x1F\x7F]/g, ""); // caracteres invisibles
    reply = reply.trim();

    // ✅ siempre devolvemos en español
    res.json({
      reply: reply || "No recibí respuesta en español"
    });

  } catch (error) {
    console.error("❌ Error en Ollama:", error);
    res.status(500).json({
      error: "Error al comunicarse con Ollama"
    });
  }
});

app.post("/api/transacciones", async (req, res) => {
  try {
    const {
      usuario_id,
      activo,
      tipo,
      cantidad,
      precio_unitario
    } = req.body;

    if (!usuario_id || !activo || !tipo || !cantidad || !precio_unitario) {
      return res.status(400).json({
        error: "Datos incompletos"
      });
    }

    const tipoNormalizado = tipo.toUpperCase();

    // 1. Insertar la transacción
    const result = await pool.query(
      `INSERT INTO transacciones (id_usuario, tipo, activo, cantidad, precio_unitario, fecha)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [usuario_id, activo, tipoNormalizado, cantidad, precio_unitario]
    );

    // 2. Buscar si ya existe en portafolio
    const portafolio = await pool.query(
      "SELECT * FROM portafolio WHERE id_usuario = $1 AND activo = $2",
      [usuario_id, activo]
    );

    let cantidad_total = 0;
    let valor_promedio = 0;

    if (portafolio.rows.length > 0) {
      cantidad_total = parseFloat(portafolio.rows[0].cantidad_total);
      valor_promedio = parseFloat(portafolio.rows[0].valor_promedio);
    }

    if (tipoNormalizado === "COMPRA") {
      const nuevaCantidad = cantidad_total + cantidad;
      const nuevoPromedio =
        (cantidad_total * valor_promedio + cantidad * precio_unitario) /
        nuevaCantidad;

      if (portafolio.rows.length > 0) {
        await pool.query(
          "UPDATE portafolio SET cantidad_total = $1, valor_promedio = $2 WHERE id_usuario = $3 AND activo = $4",
          [nuevaCantidad, nuevoPromedio, usuario_id, activo]
        );
      } else {
        await pool.query(
          "INSERT INTO portafolio (id_usuario, activo, cantidad_total, valor_promedio) VALUES ($1, $2, $3, $4)",
          [usuario_id, activo, cantidad, precio_unitario]
        );
      }
    } else if (tipoNormalizado === "VENTA") {
      const nuevaCantidad = cantidad_total - cantidad;

      if (nuevaCantidad < 0) {
        return res
          .status(400)
          .json({
            success: false,
            error: "No tienes suficientes activos para vender"
          });
      }

      const nuevoPromedio = nuevaCantidad === 0 ? 0 : valor_promedio;

      await pool.query(
        "UPDATE portafolio SET cantidad_total = $1, valor_promedio = $2 WHERE id_usuario = $3 AND activo = $4",
        [nuevaCantidad, nuevoPromedio, usuario_id, activo]
      );
    }

    res.json({
      success: true,
      transaccion: result.rows[0]
    });
  } catch (err) {
    console.error("Error guardando transacción:", err);
    res.status(500).json({
      error: "Error interno"
    });
  }
});



// Obtener el portafolio de un usuario
app.get("/api/portafolio", async (req, res) => {
  try {
    const {
      usuario_id
    } = req.query;

    if (!usuario_id) {
      return res.status(400).json({
        success: false,
        error: "Falta usuario_id"
      });
    }

    const result = await pool.query(
      `SELECT activo, cantidad_total, valor_promedio, updated_at
   FROM portafolio
   WHERE id_usuario = $1`,
      [usuario_id]
    );


    res.json({
      success: true,
      portafolio: result.rows
    });
  } catch (err) {
    console.error("Error obteniendo portafolio:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
});


// Nuevo endpoint para analizar portafolio
app.post("/api/analizar-portafolio", async (req, res) => {
  try {
    const {
      usuarioId
    } = req.body;

    console.log("👉 Analizando portafolio del usuario:", usuarioId);

    // 1. Obtener portafolio desde Postgres
    const result = await pool.query(
      "SELECT activo, cantidad_total, valor_promedio FROM portafolio WHERE id_usuario = $1",
      [usuarioId]
    );
    const portafolio = result.rows;

    if (portafolio.length === 0) {
      return res.json({
        usuarioId,
        rendimiento: [],
        analisis: "El usuario no tiene activos en su portafolio."
      });
    }

    // 2. Construir lista de símbolos únicos
    const symbols = portafolio.map(p => p.activo).join(",");

    // 3. Llamada a CoinMarketCap
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}`, {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY
        }
      }
    );
    const data = await response.json();

    // 4. Mapear precios actuales
    const preciosActuales = {};
    for (let p of portafolio) {
      if (data.data[p.activo]) {
        preciosActuales[p.activo] = data.data[p.activo].quote.USD.price;
      }
    }

    // 5. Calcular rendimiento
    const rendimiento = portafolio.map(p => {
      const precioActual = preciosActuales[p.activo] || 0;
      const valorActual = Number(p.cantidad_total) * precioActual;
      const valorInvertido = Number(p.cantidad_total) * Number(p.valor_promedio);
      const ganancia = valorActual - valorInvertido;
      const porcentaje = valorInvertido > 0 ? (ganancia / valorInvertido) * 100 : 0;

      return {
        activo: p.activo,
        cantidad: Number(p.cantidad_total),
        precioPromedio: Number(p.valor_promedio),
        precioActual: precioActual.toFixed(2),
        valorActual: valorActual.toFixed(2),
        valorInvertido: valorInvertido.toFixed(2),
        ganancia: ganancia.toFixed(2),
        porcentaje: porcentaje.toFixed(2) + "%"
      };
    });

    // 6. Pedir análisis a la IA
    const iaResponse = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-r1:1.5b",
        stream: false,
        messages: [{
            role: "system",
            content: `
Eres un asesor financiero digital.
Responde SIEMPRE en español claro, profesional y breve (máx. 200 palabras).
Incluye:
- Resumen del rendimiento del portafolio.
- Estrategia recomendada para perfil conservador, moderado y agresivo.
Evita repeticiones, errores ortográficos o palabras en inglés.
`
          },
          {
            role: "user",
            content: `Este es el portafolio del usuario con su rendimiento calculado: 
${JSON.stringify(rendimiento, null, 2)}`
          }
        ]
      })
    });

    const iaData = await iaResponse.json();
    let analisis = iaData.message?.content || "No se pudo generar un análisis.";

    // 7. Limpieza del texto de la IA
    analisis = analisis
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .replace(/\*\*/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    // 8. Respuesta final al cliente
    res.json({
      usuarioId,
      rendimiento,
      analisis
    });

  } catch (error) {
    console.error("❌ Error en análisis con IA:", error.message || error);
    res.status(500).json({
      error: "Error al analizar portafolio con IA"
    });
  }
});


//  Levantar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});