export default class ProductResponseDTO {
  constructor(product) {
    this.title = product.title;
    this.description = product.description;
    this.thumbnail = product.thumbnail;
    this.price = product.price;
    this.code = product.code;
    this.stock = product.stock;
    this.category = product.category;
  }
}
