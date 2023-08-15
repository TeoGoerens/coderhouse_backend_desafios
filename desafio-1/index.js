class ProductManager {
  static productId = 0;
  products;

  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    const product = {
      id: ProductManager.productId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error(
        `All fields must be completed to submit ${product.title} product`
      );
    } else if (this.products.find((prod) => prod.code === code)) {
      throw new Error(
        `The ${product.code} code already exists in our database. The product ${product.title} can't be registered`
      );
    } else {
      this.products.push(product);
      ProductManager.productId++;
      return product;
    }
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const productById = this.products.find((prod) => prod.id === id);
    if (productById) {
      return productById;
    } else {
      return "Not found";
    }
  }
}

const myProductManager = new ProductManager();

const product1 = myProductManager.addProduct(
  "iPhone 13 Pro",
  "New iPhone 13 Pro super skills",
  1000,
  "iPhone 13 Pro route",
  101010,
  3
);
const product2 = myProductManager.addProduct(
  "iPhone 14 Pro",
  "New iPhone 14 Pro super skills",
  1400,
  "iPhone 14 Pro route",
  202020,
  12
);
const product3 = myProductManager.addProduct(
  "iPhone 15 Pro",
  "New iPhone 15 Pro super skills",
  1700,
  "iPhone 15 Pro route",
  303030,
  5
);
const product4 = myProductManager.addProduct(
  "iPhone 16 Pro",
  "New iPhone 16 Pro super skills",
  1900,
  "iPhone 16 Pro route",
  303031,
  1
);

console.log(myProductManager.getProducts());
console.log(myProductManager.getProductById(1));
console.log(myProductManager.getProductById(6));
