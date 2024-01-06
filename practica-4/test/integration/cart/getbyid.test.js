import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Get cart by id test", () => {
  it("Should retrieve a specific cart from DB based on its id on endpoint GET /api/carts/:pid", async () => {
    const cartId = "65178ec626aa339d88fda281";
    const { statusCode, ok, _body } = await requester.get(
      `/api/carts/${cartId}`
    );
    //console.log(statusCode, ok, _body);
    expect(_body).to.not.be.empty;
    expect(statusCode).to.be.equal(200);
  });

  it("Should return status code 400 if no id is provided on endpoint GET /api/carts/:pid", async () => {
    const cartId = null;
    const { statusCode, ok, _body } = await requester.get(
      `/api/carts/${cartId}`
    );
    //console.log(statusCode, ok, _body);
    expect(statusCode).to.be.equal(404);
  });

  it("Should return status code 400 if id provided doesn't match any cart on DB on endpoint GET /api/carts/:pid", async () => {
    const cartId = "esteEsUnIdQueNoExisteEnLaDB";
    const { statusCode, ok, _body } = await requester.get(
      `/api/carts/${cartId}`
    );
    //console.log(statusCode, ok, _body);
    expect(statusCode).to.be.equal(404);
  });
});
