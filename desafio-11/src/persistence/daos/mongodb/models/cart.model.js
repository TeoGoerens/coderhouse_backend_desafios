import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: Number,
    },
  ],
});

const cartModel = mongoose.model(cartCollection, cartSchema);
export { cartModel };
