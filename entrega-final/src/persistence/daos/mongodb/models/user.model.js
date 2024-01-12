import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  role: {
    type: String,
    enum: ["user", "premium", "admin"],
    default: "user",
  },

  password: String,
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
    default: null,
  },

  documents: [{ name: String, reference: String }],

  last_connection: {
    type: Date,
    default: null,
  },
});

const userModel = mongoose.model(userCollection, userSchema);
export { userModel };
