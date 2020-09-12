import "mocha";
import * as chai from "chai";
import api from "./api";

const expect = chai.expect;

describe("[Feature] Connection", () => {
  context("Status check", () => {
    it("returns 200 - GET (within 1000 ms)", function (done) {
      this.timeout(1000);
      api()
        .get("/status")
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
    it("returns 200 - HEAD (within 1000 ms)", function (done) {
      this.timeout(100);
      api()
        .head("/status")
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
