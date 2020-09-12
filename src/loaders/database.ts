import "reflect-metadata";
import { getConnectionOptions, createConnection, getConnection } from "typeorm";

const dbConnection = {
  async create() {
    let name = "default";
    if (process.env.NODE_ENV === "test") {
      name = process.env.NODE_ENV;
      console.log("[DB] TEST_DB");
    }

    const connectionOptions = await getConnectionOptions(name);
    return await createConnection({ ...connectionOptions, name: "default" });
  },
  async close() {
    getConnection().close();
  },
  async clear() {
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    entities.forEach(async (entity) => {
      const repository = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });
  },
};

export default dbConnection;
