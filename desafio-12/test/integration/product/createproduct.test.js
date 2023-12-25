import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Create product test", () => {
  it("Should create a new product on endpoint POST /api/products", async () => {
    const product = {
      title: "Test Product",
      description: "Test Product Description",
      price: 100,
      thumbnail: [],
      code: "AABBCCDD",
      stock: 10,
      category: "Test Category",
    };

    const { statusCode, ok, _body } = await requester
      .post(`/api/products`)
      .send(product);

    expect(statusCode).to.be.equal(200);
  });
});
