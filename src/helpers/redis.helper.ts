import { redisClient } from "../redis";

export const REDIS_KEY_LAST_SYNCED_DAY_TIMESTAMP_START_MS =
  "lastSyncedDayTimestampStartMs";

export class RedisHelper {
  static async getValue(key: string): Promise<string | null> {
    const value = await redisClient.get(key);
    return value;
  }

  static async setValue(key: string, value: any): Promise<string | null> {
    await redisClient.set(key, value);
    return await this.getValue(key);
  }
}

export default new RedisHelper();
