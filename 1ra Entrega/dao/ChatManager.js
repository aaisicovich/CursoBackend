import { messageModel } from "./models/Messages.js";

class ChatManager {
    async getMessages() {
        return await messageModel.find().lean();
    }

    async createMessage(message) {
        return await messageModel.create(message);
    }
}

export default ChatManager;