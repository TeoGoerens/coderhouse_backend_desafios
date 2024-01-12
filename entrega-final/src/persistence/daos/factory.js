import ProductManagerMongo from "./mongodb/managers/product.manager.js";
import CartManagerMongo from "./mongodb/managers/cart.manager.js";
import UserManagerMongo from "./mongodb/managers/user.manager.js";
import TicketManagerMongo from "./mongodb/managers/ticket.manager.js";
import { initMongoDB } from "./mongodb/connection.js";

let productManager;
let cartManager;
let userManager;
let ticketManager;
let persistence = "mongo";
//let persistence = process.argv[2] || "mongo";

switch (persistence) {
  case "mongo":
    await initMongoDB();
    productManager = new ProductManagerMongo();
    cartManager = new CartManagerMongo();
    userManager = new UserManagerMongo();
    ticketManager = new TicketManagerMongo();
    break;
  case "file":
    //productManager = newProductManagerFS();
    break;
  default:
    await initMongoDB();
    productManager = new ProductManagerMongo();
    cartManager = new CartManagerMongo();
    userManager = new UserManagerMongo();
    ticketManager = new TicketManagerMongo();
    break;
}

export { productManager, cartManager, userManager, ticketManager };
