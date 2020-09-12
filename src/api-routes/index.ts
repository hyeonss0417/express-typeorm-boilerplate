import urlShortener from "./routes/urlShortener";
import { Router } from "express";

export default () => {
  const app = Router();
  urlShortener(app);

  return app;
};
