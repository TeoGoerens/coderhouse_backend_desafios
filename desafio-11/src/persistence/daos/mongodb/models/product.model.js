import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: Array,
  code: String,
  stock: Number,
  status: Boolean,
  category: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: "65233a8b095b219611df358e",
  },
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);
export { productModel };
