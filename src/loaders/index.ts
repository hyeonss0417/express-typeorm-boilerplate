import expressLoader from "./express";
import dependencyInjectorLoder from "./dependencyInjector";
import databaseLoader from "./database";
import Logger from "./logger";
import { Url } from "../entity/Url";
import { User } from "../entity/User";

export default async ({ expressApp }) => {
  const connection = await databaseLoader.create();
  Logger.info("✅ DB loaded and connected!");

  await dependencyInjectorLoder({
    repositories: [Url, User].map((e) => ({
      name: e.name.charAt(0).toLowerCase() + e.name.slice(1) + "Repository",
      repository: connection.manager.getRepository(e),
    })),
  });
  Logger.info("✅ Dependency Injector loaded.");

  await expressLoader({ app: expressApp });
  Logger.info("✅ Express loaded.");
};
