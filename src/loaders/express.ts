import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as cors from "cors";
import bodyParser = require("body-parser");
import config from "../config";
import apiRoutes from "../api-routes";
import { CustomError } from "../utils/CustomError";
import { isCelebrateError, CelebrateError } from "celebrate";
import LoggerInstance from "./logger";

export default ({ app }: { app: express.Application }) => {
  app.get("/status", (req, res) => {
    res.status(200).end();
  });
  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable("trust proxy");

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  app.use(require("method-override")());

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(config.api.prefix, apiRoutes());

  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new CustomError("NOT_FOUND", 404, "The page does not exist."));
  });

  // Custom Error Handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
      LoggerInstance.error(
        `[${err.status}/Custom] ${err.code} - ${err.message}`
      );
      return res
        .status(err.status)
        .send({
          error: err.code,
          message: err.message,
        })
        .end();
    }
    return next(err);
  });

  // Handle 400 Request Validation Error. (thrown by Celebrate)
  app.use((err: Error, req, res: Response, next: NextFunction) => {
    if (isCelebrateError(err)) {
      const messages = [];
      (err as CelebrateError).details.forEach((v, k) => {
        messages.push(`[${k}] ${v.message}.`);
      });
      const message = messages.join("\n");
      const code = "WRONG_INPUT";
      LoggerInstance.error(`[400/Celebrate] ${code} - ${message}`);
      return res.status(400).send({
        error: code,
        message,
      });
    }
    return next(err);
  });

  // Handle 401 Authorization Error (thrown by express-jwt)
  app.use((err: Error, req, res: Response, next: NextFunction) => {
    if (err.name === "UnauthorizedError") {
      const code = "UNAUTHORIZED";
      LoggerInstance.error(`[401/Authorization] ${code} - ${err.message}`);
      return res.status(401).send({
        error: code,
        message: err.message,
      });
    }
    return next(err);
  });

  // Handle Generic Error
  app.use((err: Error, req, res: Response, next: NextFunction) => {
    const code = "GENERIC";
    const message =
      "Something went wrong. Please try again or contact support.";
    LoggerInstance.error(`[500/GENERIC] ${code} - ${message}`);
    res.status(500).send({
      error: code,
      message,
    });
    next();
  });
};
