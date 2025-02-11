const Message = require("../models/Message");

class MessageDAO {
  async getAllMessages() {
    return await Message.find();
  }

  async addMessage(user, message) {
    const newMessage = new Message({ user, message });
    return await newMessage.save();
  }
}

module.exports = new MessageDAO();
