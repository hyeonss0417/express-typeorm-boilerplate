import { Router, Request, Response, NextFunction } from "express";
import { IUrlInputDTO } from "../../interfaces/IUrl";
import Container from "typedi";
import UrlShortenrService from "../../services/urlShortener";
import { Logger } from "winston";
import middlewares from "../middlewares";

const route = Router();

export default (app: Router) => {
  app.use(route);

  route.post(
    "/register",
    middlewares.validators.shortenUrl,
    async function shortenUrlAction(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      const logger: Logger = Container.get("logger");
      logger.debug("Calling Shorten URL endpoint with body: %o", req.body);
      try {
        const urlShortenerServiceInstance = Container.get(UrlShortenrService);
        const shortenedUrl = await urlShortenerServiceInstance.ShortenUrl(
          req.body as IUrlInputDTO
        );
        res.status(201).send(shortenedUrl);
      } catch (err) {
        next(err);
      }
    }
  );

  route.get("/urls", async function getAllUrlsAcion(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const logger: Logger = Container.get("logger");
    logger.debug("Calling Get all URLs endpoint.");
    try {
      const urlShortenerServiceInstance = Container.get(UrlShortenrService);
      const urls = await urlShortenerServiceInstance.GetAllUrls();
      res.status(200).send(urls);
    } catch (err) {
      next(err);
    }
  });

  route.get("/:accessKey", async function redirectToUrlAction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const logger: Logger = Container.get("logger");
    logger.debug(
      "Calling Redirect to the url endpoint with params: %o",
      req.params
    );
    const accessKey = req.params.accessKey as string;
    try {
      const urlShortenerServiceInstance = Container.get(UrlShortenrService);
      const url = await urlShortenerServiceInstance.GetRedirectUrl(accessKey);
      res.redirect(302, url);
    } catch (err) {
      next(err);
    }
  });

  route.get("/:accessKey/stat", async function getUrlStatisticsAction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const logger: Logger = Container.get("logger");
    logger.debug(
      "Calling Get url statistics endpoint with params: %o",
      req.params
    );
    const accessKey = req.params.accessKey as string;
    try {
      const urlShortenerServiceInstance = Container.get(UrlShortenrService);
      const urlStat = await urlShortenerServiceInstance.GetUrlStatistics(
        accessKey
      );
      res.status(200).send(urlStat);
    } catch (err) {
      next(err);
    }
  });
};
