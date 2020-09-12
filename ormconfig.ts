import { ConnectionOptions } from "typeorm";
import config from "./src/config";

const conectionOptions: ConnectionOptions[] = [
  {
    name: "default",
    type: "mysql",
    host: config.orm.host,
    port: config.orm.port,
    username: config.orm.username,
    password: config.orm.password,
    database: config.orm.database,
    synchronize: false,
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber",
    },
  },
  {
    name: "test",
    type: "mysql",
    host: config.orm.host,
    port: config.orm.port,
    username: config.orm.username,
    password: config.orm.password,
    database: config.orm.test_database,
    synchronize: true,
    dropSchema: true,
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber",
    },
  },
];

export = conectionOptions;
