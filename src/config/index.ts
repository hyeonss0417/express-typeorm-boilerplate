import * as dotenv from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port: parseInt(process.env.PORT, 10),

  domainName: process.env.DOMAIN_NAME,

  urlRoot: `${process.env.PROTOCOL}://${process.env.DOMAIN_NAME}:${process.env.PORT}`,

  orm: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    test_database: process.env.DB_TEST_DATABASE,
  },

  jwtSecret: process.env.JWT_SECRET,

  api: {
    prefix: "/",
  },

  logs: {
    level: process.env.LOG_LEVEL || "silly",
    logDir: "log",
  },

  emails: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};
