// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");
const bcrypt = require("bcrypt");
const axios = require("axios");
const cryptoRoutes = require("./routes/cryptoRoutes");
const UsuarioRepositoryFactory = require("./factories/UsuarioRepositoryFactory");
const TransaccionRepository = require("./repositories/TransaccionRepository");
const PortafolioRepositoryFactory = require("./factories/PortafolioRepositoryFactory");
const portafolioRoutes = require("./routes/portafolioRoutes");
const analisisRoutes = require("./routes/analisisRoutes");
const historyRoutes = require("./routes/historyRoutes");


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


// Crear instancia del repositorio de usuarios
const factory = new UsuarioRepositoryFactory(pool);
const usuarioRepo = factory.create();

// Crear instancia del repositorio de transacciones
const transaccionRepo = new TransaccionRepository(pool);

// Ruta de prueba para ver que el server funciona
app.get("/", (req, res) => {
  res.send("Servidor funcionando ✅");
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await usuarioRepo.login(email, password);

    if (usuario === null) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }
    if (usuario === false) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({
      message: "Login exitoso ✅",
      usuario
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error en el servidor 🚨" });
  }
});

// Usuarios para select
app.get("/usuarios-select-all", async (req, res) => {
  try {
    const usuarios = await usuarioRepo.listarSelectAll();
    res.json(usuarios);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Crear usuario
app.post("/usuarios", async (req, res) => {
  try {
    const usuario = await usuarioRepo.crear(req.body);
    res.status(201).json({
      message: "Usuario creado ✅",
      usuario
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Error en el servidor "
    });
  }
});

// Listar usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await usuarioRepo.listar();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      error: "Error en el servidor "
    });
  }
});

// Obtener usuario por ID
app.get("/usuarios/:id", async (req, res) => {
  try {
    const usuario = await usuarioRepo.obtenerPorId(req.params.id);
    if (!usuario) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }
    res.json(usuario);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Error en el servidor "
    });
  }
});

// Actualizar usuario
app.put("/usuarios/:id", async (req, res) => {
  try {
    const usuario = await usuarioRepo.actualizar(req.params.id, req.body);
    if (!usuario) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }
    res.json({
      message: "Usuario actualizado ",
      usuario
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Error en el servidor "
    });
  }
});

// Eliminar usuario
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const usuario = await usuarioRepo.eliminar(req.params.id);
    if (!usuario) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }
    res.json({
      message: "Usuario eliminado ✅",
      usuario
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Error en el servidor "
    });
  }
});

// Obtener transacciones por usuario
app.get("/transacciones/:idUsuario", async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const transacciones = await transaccionRepo.obtenerPorUsuario(idUsuario);

    if (transacciones.length === 0) {
      return res.json({ mensaje: "No hay transacciones para este usuario" });
    }

    res.json(transacciones);
  } catch (err) {
    console.error("Error al obtener transacciones:", err);
    res.status(500).json({ error: "Error en el servidor " });
  }
});

// ===============================
// Nueva ruta: Precios de criptos con CoinMarketCap
// ===============================

// Usamos rutas separadas para mantener el código organizado - con method factory
app.use("/api/crypto", cryptoRoutes);
// Endpoint historial OHLCV usando CoinGecko
app.use(historyRoutes);


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

// crear transacción por usuario
app.post("/api/transacciones", async (req, res) => {
  try {
    const transaccion = await transaccionRepo.crear(req.body);
    res.json({
      success: true,
      transaccion
    });
  } catch (err) {
    console.error("Error guardando transacción:", err.message);
    res.status(400).json({
      success: false,
      error: err.message || "Error interno"
    });
  }
});


// Rutas de portafolio por usuario
app.use("/api/portafolio", portafolioRoutes);

// Nuevo endpoint para analizar portafolio
app.use(analisisRoutes);

//  Levantar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});