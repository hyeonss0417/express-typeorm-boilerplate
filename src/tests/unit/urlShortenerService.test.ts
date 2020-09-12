import "mocha";
import * as chai from "chai";
import UrlShortenrService from "../../services/urlShortener";

import { getRepository } from "typeorm";
import { Url } from "../../entity/Url";
import { isUrlFormat } from "../../utils/utils";
import { urlSeeder, getRandomUrlSeed, urlSeeds } from "../Seeder/urlSeeder";
import { CustomError } from "../../utils/CustomError";
import dbConnection from "../../loaders/database";

const expect = chai.expect;

describe("[Unit] UrlShortener Service test", () => {
  beforeEach("DB Clear & Make Seeds", async () => {
    await dbConnection.clear();
    await urlSeeder();
  });
  context("🔎 ShortenUrl", () => {
    it("should return shortened URL", async function () {
      const urlShortenerService = new UrlShortenrService(getRepository(Url));
      const { url } = await urlShortenerService.ShortenUrl({
        url: "https://www.naver.com",
      });
      expect(url).to.not.be.undefined;
      expect(isUrlFormat(url)).to.be.true;
    });

    it("should return shortened URL with custom accessKey", async function () {
      const customKey = "customKey";
      const urlShortenerService = new UrlShortenrService(getRepository(Url));
      const { url } = await urlShortenerService.ShortenUrl({
        url: "https://www.naver.com",
        accessKey: customKey,
      });
      expect(url).to.not.be.undefined;
      expect(isUrlFormat(url)).to.be.true;
      expect(url.slice(url.lastIndexOf("/"))).to.be.equal(`/${customKey}`);
    });

    it("should return Error (DUPLICATE_KEY)", async function () {
      const urlShortenerService = new UrlShortenrService(getRepository(Url));

      const err: CustomError = await urlShortenerService
        .ShortenUrl({
          url: "https://www.naver.com",
          accessKey: "existKey",
        })
        .catch((e) => e);
      expect(err).to.be.an("error");
      expect(err.code).to.be.equal("DUPLICATE_KEY");
    });
  });

  context("🔎 GetRedirectUrl", () => {
    it("should return the url for redirection", async function () {
      const urlSeed = getRandomUrlSeed();
      const urlShortenerService = new UrlShortenrService(getRepository(Url));
      const url = await urlShortenerService.GetRedirectUrl(urlSeed.accessKey);

      expect(url).to.not.be.undefined;
      expect(url).to.be.equal(urlSeed.url);
    });

    it("should return Error (NOT_FOUND)", async function () {
      const urlShortenerService = new UrlShortenrService(getRepository(Url));
      const err: CustomError = await urlShortenerService
        .GetRedirectUrl("NonexistKey")
        .catch((e) => e);

      expect(err).to.be.an("error");
      expect(err.code).to.be.equal("NOT_FOUND");
    });
  });

  context("🔎 GetUrlStatistics", () => {
    it("should return statistics of the url", async function () {
      const urlSeed = getRandomUrlSeed();
      const urlShortenerService = new UrlShortenrService(getRepository(Url));
      const statistics = await urlShortenerService.GetUrlStatistics(
        urlSeed.accessKey
      );

      expect(statistics).to.not.be.undefined;
      expect(statistics.url).to.be.equal(urlSeed.url);
      expect(statistics.accessKey).to.be.equal(urlSeed.accessKey);
      expect(statistics.accessCount).to.be.equal(urlSeed.accessCount);
      expect(statistics.createDate).to.be.instanceOf(Date);
    });

    it("should return Error (NOT_FOUND)", async function () {
      const urlShortenerService = new UrlShortenrService(getRepository(Url));
      const err: CustomError = await urlShortenerService
        .GetUrlStatistics("NonexistKey")
        .catch((e) => e);

      expect(err).to.be.an("error");
      expect(err.code).to.be.equal("NOT_FOUND");
    });
  });

  context("🔎 GetAllUrls", () => {
    it("should return all urls", async function () {
      const urlShortenerService = new UrlShortenrService(getRepository(Url));
      const urls = await urlShortenerService.GetAllUrls();

      expect(urls).to.not.be.undefined;
      expect(urls.length).to.be.equal(urlSeeds.length);
    });
  });
});
