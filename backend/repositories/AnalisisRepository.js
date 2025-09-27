const fetch = require("node-fetch");

class AnalisisRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async obtenerPortafolio(usuarioId) {
    const result = await this.pool.query(
      "SELECT activo, cantidad_total, valor_promedio FROM portafolio WHERE id_usuario = $1",
      [usuarioId]
    );
    return result.rows;
  }

  async obtenerPreciosCoinMarketCap(symbols) {
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}`, {
        headers: { "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY }
      }
    );
    return response.json();
  }

  calcularRendimiento(portafolio, precios) {
    return portafolio.map(p => {
      const precioActual = precios[p.activo] || 0;
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
  }

  async pedirAnalisisIA(rendimiento) {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "deepseek-r1:1.5b",
        stream: false,
        messages: [
          {
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

    const iaData = await response.json();
    let analisis = iaData.message?.content || "No se pudo generar un análisis.";
    return analisis
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .replace(/\*\*/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }
}

module.exports = AnalisisRepository;
