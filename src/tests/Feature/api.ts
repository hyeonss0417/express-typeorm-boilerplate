import { app, startServer } from "../../app";

import "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import dbConnection from "../../loaders/database";

chai.use(chaiHttp);

before("Starting Server", async () => await startServer());
after(async () => await dbConnection.close());

export default () => chai.request(app);
