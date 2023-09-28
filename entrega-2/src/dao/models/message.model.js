import mongoose from "mongoose";

const messageCollection = "messages";

const messageSchema = new mongoose.Schema({
  mail: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const messageModel = mongoose.model(messageCollection, messageSchema);
export { messageModel };
