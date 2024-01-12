import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Get all carts test", () => {
  it("Should retrieve all carts from DB on endpoint GET /api/carts", async () => {
    const { statusCode, ok, _body } = await requester.get("/api/carts");
    expect(_body).to.not.be.empty;
  });
});
