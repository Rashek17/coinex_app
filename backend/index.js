// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { OpenAI  } = require("openai");
const { GPT4All } = require('gpt4all');
const path = require('path');

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
      facebook,
      twitter,
      instagram,
      linkedin,
      username,
      contrasena,
      estado_activo,
    } = req.body;

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
        facebook || null,
        twitter || null,
        instagram || null,
        linkedin || null,
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

// ===============================
// 🔥 Nueva ruta: Precios de criptos con CoinMarketCap
// ===============================
app.get("/api/crypto/:symbol", async (req, res) => {
  const symbol = req.params.symbol;
  const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`, {
    headers: {
      "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY
    }
  });
  const data = await response.json();
  res.json(data);
});

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
      console.log("👉 Entró al endpoint /api/crypto/dataTable");
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


//  Levantar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});