import { httpServer } from "../app.js";
import { Server } from "socket.io";
import { app } from "../app.js";
import { messageModel } from "../persistence/daos/mongodb/models/message.model.js";

const socketInit = () => {
  const socketServer = new Server(httpServer);
  app.use((req, res, next) => {
    req.context = { socketServer };
    next();
  });

  socketServer.on("connection", (socket) => {
    console.log(`User ${socket.id} is now connected`);
    socket.on("message", async (data) => {
      await messageModel.create(data);
      const messages = await messageModel.find().lean();

      socketServer.emit("new_message", messages);
    });
  });
};

export default socketInit;
