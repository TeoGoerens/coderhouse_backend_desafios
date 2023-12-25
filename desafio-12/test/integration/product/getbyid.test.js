import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Get product by id test", () => {
  it("Should retrieve a specific product from DB based on its id on endpoint GET /api/products/:pid", async () => {
    const productId = "6508ea1ff5f2c103656526c6";
    const { statusCode, ok, _body } = await requester.get(
      `/api/products/${productId}`
    );
    //console.log(statusCode, ok, _body);
    expect(_body).to.not.be.empty;
    expect(statusCode).to.be.equal(200);
  });

  it("Should return status code 400 if no id is provided on endpoint GET /api/products/:pid", async () => {
    const productId = null;
    const { statusCode, ok, _body } = await requester.get(
      `/api/products/${productId}`
    );
    //console.log(statusCode, ok, _body);
    expect(statusCode).to.be.equal(404);
  });

  it("Should return status code 400 if id provided doesn't match any product on DB on endpoint GET /api/products/:pid", async () => {
    const productId = "esteEsUnIdQueNoExisteEnLaDB";
    const { statusCode, ok, _body } = await requester.get(
      `/api/carts/${productId}`
    );
    //console.log(statusCode, ok, _body);
    expect(statusCode).to.be.equal(404);
  });
});
