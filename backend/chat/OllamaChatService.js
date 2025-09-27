// backend/chat/OllamaChatService.js
const ChatService = require("./ChatService");
const fetch = require("node-fetch"); // si usas Node <18

class OllamaChatService extends ChatService {
    async sendMessage(message) {
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
                    }
                ]
            }),
        });

        const data = await response.json();
        let reply = data.message?.content || "No se pudo interpretar la respuesta";
        reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, "")
            .replace(/[\x00-\x1F\x7F]/g, "")
            .trim();
        return reply || "No recibí respuesta en español";
    }
}

module.exports = OllamaChatService;