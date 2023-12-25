import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Get all products test", () => {
  it("Should retrieve all products from DB on endpoint GET /api/products", async () => {
    const { statusCode, ok, _body } = await requester.get("/api/products");
    expect(_body).to.not.be.empty;
  });
});
