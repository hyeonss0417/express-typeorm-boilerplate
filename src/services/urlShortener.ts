import { Service, Inject } from "typedi";
import { Url } from "../entity/Url";
import { CustomError } from "../utils/CustomError";
import { generateRandomKey } from "../utils/utils";
import { Repository } from "typeorm";
import { IUrlInputDTO } from "../interfaces/IUrl";
import config from "../config";
import _ = require("lodash");

@Service()
export default class UrlShortenrService {
  constructor(
    @Inject("urlRepository") private urlRepository: Repository<Url>
  ) {}

  public async ShortenUrl(urlInputDTO: IUrlInputDTO): Promise<{ url: string }> {
    const customAccessKey = urlInputDTO.accessKey;

    if (customAccessKey) {
      await this.validateAccesKey(customAccessKey);
    } else {
      urlInputDTO.accessKey = await this.getRandomUniqueAccessKey();
    }

    const newUrl = await this.urlRepository.create(urlInputDTO);
    return { url: `${config.urlRoot}/${newUrl.accessKey}` };
  }

  public async GetRedirectUrl(accessKey: string): Promise<string> {
    const existUrl = await this.getUrlByAccessKey(accessKey);
    await this.increaseAccessCount(existUrl);
    return existUrl.url;
  }

  public async GetUrlStatistics(accessKey: string) {
    const url = await this.getUrlByAccessKey(accessKey);
    return _.pick(url, ["url", "accessKey", "accessCount", "createDate"]);
  }

  public async GetAllUrls(): Promise<Url[]> {
    return await this.urlRepository.find();
  }

  private async getUrlByAccessKey(accessKey: string): Promise<Url> {
    const url = await this.urlRepository.findOne({ accessKey });
    if (!url) {
      throw new CustomError("NOT_FOUND", 404, "This is an invalid URL.");
    }
    return url;
  }

  private async validateAccesKey(accessKey: string) {
    if (!(await this.isUniqueAccessKey(accessKey))) {
      throw new CustomError(
        "DUPLICATE_KEY",
        400,
        "This access key already exists"
      );
    }
  }

  private async isUniqueAccessKey(accessKey: string) {
    const existUrl = await this.urlRepository.findOne({ accessKey });
    if (!existUrl) return true;
    else return false;
  }

  private async increaseAccessCount(url: Url) {
    url.accessCount++;
    await this.urlRepository.save(url);
  }

  private async getRandomUniqueAccessKey() {
    const maximumTry = 10;
    for (let i = 0; i < maximumTry; i++) {
      const newKey = generateRandomKey();
      if (await this.isUniqueAccessKey(newKey)) return newKey;
    }
    throw new CustomError(
      "SERVICE_ERROR",
      500,
      "Could not generate unique access key."
    );
  }
}
