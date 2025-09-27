const OllamaChatService = require("./OllamaChatService");

class ChatServiceFactory {
  static create(type) {
    switch(type) {
      case "OLLAMA":
        return new OllamaChatService();
      // aquí puedes agregar otros servicios como OpenAI, Mock, etc.
      default:
        throw new Error(`Tipo de chat no soportado: ${type}`);
    }
  }
}

module.exports = ChatServiceFactory;
