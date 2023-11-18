import mongoose from "mongoose";

const productCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: String,
  purchase_datetime: Date,
  amount: Number,
  purchaser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const ticketModel = mongoose.model(productCollection, ticketSchema);
export { ticketModel };
