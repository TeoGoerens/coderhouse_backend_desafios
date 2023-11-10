import ProductManagerMongo from "./mongodb/managers/product.manager.js";
import CartManagerMongo from "./mongodb/managers/cart.manager.js";
import { initMongoDB } from "./mongodb/connection.js";

let productManager;
let cartManager;
let persistence = "mongo";
//let persistence = process.argv[2] || "mongo";

switch (persistence) {
  case "mongo":
    await initMongoDB();
    productManager = new ProductManagerMongo();
    cartManager = new CartManagerMongo();
    break;
  case "file":
    //productManager = newProductManagerFS();
    break;
  default:
    await initMongoDB();
    productManager = new ProductManagerMongo();
    cartManager = new CartManagerMongo();
    break;
}

export { productManager, cartManager };
