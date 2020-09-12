import LoggerInstance from "./logger";
import Container from "typedi";
import * as mailgun from "mailgun-js";
import config from "../config";

export default ({
  repositories,
}: {
  repositories: { name: string; repository: any }[];
}) => {
  try {
    repositories.forEach(async (r) => {
      Container.set(r.name, r.repository);
    });

    Container.set("logger", LoggerInstance);
    Container.set(
      "emailClient",
      mailgun({ apiKey: config.emails.apiKey, domain: config.emails.domain })
    );
  } catch (e) {
    LoggerInstance.error("🔥 Error on dependency injector loader: %o", e);
    throw e;
  }
};
