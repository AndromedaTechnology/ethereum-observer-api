import app from "./app";
import server from "./server";
import { databaseSetup } from "./database";
import { redisSetup } from "./redis";

if (process.env.NODE_ENV !== "test") {
  databaseSetup();
  redisSetup();
}

export { app, server };
