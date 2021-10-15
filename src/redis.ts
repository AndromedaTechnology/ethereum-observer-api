import { createClient } from "redis";

let redisClient: any;

async function redisSetup(): Promise<any> {
  redisClient = createClient();
  await redisClient.connect();
  redisClient.on("error", (err: any) => console.log("Redis Client Error", err));
  return redisClient;
}

export { redisClient, redisSetup };
