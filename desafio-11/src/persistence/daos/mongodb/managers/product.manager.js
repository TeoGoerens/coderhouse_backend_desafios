import MongoDao from "../mongo.dao.js";
import { productModel } from "../models/product.model.js";

export default class ProductManagerMongo extends MongoDao {
  constructor() {
    super(productModel);
  }

  async getProducts(limit, page, query, sort) {
    try {
      const options = {
        limit,
        page,
        customLabels: { docs: "payload" },
      };

      if (sort !== "") {
        options.sort = { price: sort };
      }

      const queryFilter = query === "" ? {} : { category: query };

      const products = await this.model.paginate(queryFilter, options);

      return products;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
