import {
  RedisHelper,
  REDIS_KEY_LAST_SYNCED_DAY_TIMESTAMP_START_MS,
} from "../../../helpers/redis.helper";
import { BlockDto } from "../../block/block.model";
import summaryHelper, { ISummaries } from "./summary.helper";

/**
 * SummarySyncHelper
 */
class SummarySyncHelper {
  /**
   * Sync Summary to Blockhain
   *
   * @param {BLockDto} lastBlock Used as a reference point for sync range end
   *
   * @returns {ISummaries} Synced values
   */
  async calculateAndSyncSummaryToBlockchain(lastBlock: BlockDto): Promise<any> {
    if (!lastBlock.timestamp) return null;

    // Get sync dates
    const dateStart = await this.getSyncDateStart();
    const dateEnd = (await this.getSyncDateEnd(lastBlock))!;

    // Get summary
    let summary: ISummaries | null = null;
    if (this.isSyncRangeValid(dateStart, dateEnd)) {
      summary = await summaryHelper.getSummary(
        dateStart?.getTime(),
        dateEnd.getTime()
      );
    }

    await this.logSync(lastBlock, dateStart, dateEnd, summary);

    if (summary) {
      // Sync to blockchain
      for (const key of Object.keys(summary)) {
        // await networkContractHelper.updateContractState(
        //   Number.parseInt(key),
        //   summary[key as any].blocks,
        //   summary[key as any].gas
        // );
        // Save lastSynced Date start in miliseconds
        await RedisHelper.setValue(
          REDIS_KEY_LAST_SYNCED_DAY_TIMESTAMP_START_MS,
          key
        );
      }
    } else if (dateStart) {
      // Save lastSynced Date start in miliseconds
      // if no summary available, set date as done, to later advance the cursor to the next day
      await RedisHelper.setValue(
        REDIS_KEY_LAST_SYNCED_DAY_TIMESTAMP_START_MS,
        dateStart.getTime().toString()
      );
    }

    return summary;
  }

  private async logSync(
    lastBlock: BlockDto,
    dateStart?: Date,
    dateEnd?: Date,
    summary?: ISummaries | null
  ) {
    const lastSynced = await RedisHelper.getValue(
      REDIS_KEY_LAST_SYNCED_DAY_TIMESTAMP_START_MS
    );
    const lastSyncedDate = lastSynced
      ? new Date(Number.parseInt(lastSynced))
      : undefined;
    // Console
    console.log(
      "- summarySyncBEGIN -",
      `\nlastBlock:`,
      lastBlock,
      `\nlastSyncedDay: (timestamp: ${lastSyncedDate?.getTime()}):`,
      lastSyncedDate?.toString(),
      `\ngetSummaryDateStart: (timestamp: ${dateStart?.getTime()}):`,
      dateStart?.toString(),
      `\ngetSummaryDateEnd: (timestamp: ${dateEnd?.getTime()}):`,
      dateEnd?.toString(),
      `\nsummary: `,
      summary,
      "\n- summarySyncEND - "
    );
  }

  /**
   * Get first date to sync from
   *
   * a) from redis (last saved value + 1 day)
   * b) undefined - sync from the first record
   *
   * @returns {Date|undefined}
   */
  private async getSyncDateStart(): Promise<Date | undefined> {
    // Get last synced date
    const redisVal: string | null = await RedisHelper.getValue(
      REDIS_KEY_LAST_SYNCED_DAY_TIMESTAMP_START_MS
    );
    const lastSyncedDayTimestampStartMs: number | null = redisVal
      ? Number.parseInt(redisVal)
      : null;

    // Get next day to be synced
    let date = undefined;
    if (lastSyncedDayTimestampStartMs) {
      date = new Date(lastSyncedDayTimestampStartMs);
      date.setDate(date.getDate() + 1);
    }

    return date;
  }

  /**
   * Get sync date end
   *
   * We are not syncing date of the mined lastBlock,
   * as the day has not passed.
   *
   * We are syncing up, and including, the previous day of the block that was just mined (lastBlock).
   *
   * @returns {Date}
   */
  private async getSyncDateEnd(lastBlock: BlockDto): Promise<Date | undefined> {
    if (!lastBlock.timestamp) return undefined;
    const date = new Date(lastBlock.timestamp! * 1000);
    return summaryHelper.getDateStartOfTheDay(date);
  }

  /**
   * Is sync range valid?
   */
  private isSyncRangeValid(dateStart?: Date, dateEnd?: Date): boolean {
    if (dateStart && dateEnd) {
      return dateStart < dateEnd;
    }
    return true;
  }
}

export default new SummarySyncHelper();
