import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Add product to cart test", () => {
  it("Should return an updated cart and status 200 when a correct product id and correct cart id are submitted on endpoint POST /api/carts/:cid/product/:pid", async () => {
    const cartId = "65178ec726aa339d88fda283";
    const productId = "6508ea1ff5f2c103656526c6";

    const { statusCode, ok, _body } = await requester
      .post(`/api/carts/${cartId}/product/${productId}`)
      .send();

    //console.log(statusCode, ok, _body);
    expect(_body.cart).to.not.be.empty;
    expect(statusCode).to.be.equal(200);
  });

  it("Should return error and status 404 if cart id provided doesn't match an existing on DB on endpoint POST /api/carts/:cid/product/:pid", async () => {
    const cartId = "thisCartIdDoesntExist";
    const productId = "6508ea1ff5f2c103656526c6";

    const { statusCode, ok, _body } = await requester
      .post(`/api/carts/${cartId}/product/${productId}`)
      .send();

    expect(_body.error).to.not.be.empty;
    expect(statusCode).to.be.equal(404);
  });

  it("Should return error and status 404 if product id provided doesn't match an existing on DB on endpoint POST /api/carts/:cid/product/:pid", async () => {
    const cartId = "65178ec726aa339d88fda283";
    const productId = "thisProductIdDoesntExist";

    const { statusCode, ok, _body } = await requester
      .post(`/api/carts/${cartId}/product/${productId}`)
      .send();

    expect(_body.error).to.not.be.empty;
    expect(statusCode).to.be.equal(404);
  });
});
