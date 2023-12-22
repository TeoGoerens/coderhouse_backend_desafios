import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Add new cart test", () => {
  it("Should create a new cart on DB on endpoint POST /api/carts", async () => {
    const { statusCode, ok, _body } = await requester.post("/api/carts").send();
    expect(_body.message).to.not.be.empty;
  });
});
