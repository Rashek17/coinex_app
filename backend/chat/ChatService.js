class ChatService {
  async sendMessage(message) {
    throw new Error("Debe implementarse en la subclase");
  }
}

module.exports = ChatService;
