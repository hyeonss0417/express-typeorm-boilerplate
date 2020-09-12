import * as chai from "chai";
import chaiHttp = require("chai-http");
import { CustomError } from "./CustomError";

chai.use(chaiHttp);
const expect = chai.expect;

export const expectReponseCustomError = (
  res: any,
  code: string,
  status: number
) => {
  expect(res).to.have.status(status);
  expect(res).to.be.json;
  expect(res.body.error).to.be.equal(code);
};

export const expectCustomError = (err: Error, code: string, status: number) => {
  expect(err).to.be.instanceOf(CustomError);
  if (err instanceof CustomError) {
    expect(err.code).to.be.equal(code);
    expect(err.status).to.be.equal(status);
  }
};
