import { BigNumber } from "@ethersproject/bignumber";

import { BlockDto } from "../../block/block.model";
import blockService from "../../block/block.service";

export interface IDaySummary {
  blocks?: number;
  gas?: string; // BigNumber
}

export interface ISummaries {
  [dayTimestampStart: number]: IDaySummary;
}

/**
 * SummaryHelper
 */
class SummaryHelper {
  /**
   * Get Summary
   *
   * @param {number} [timestampStartMs]
   * @param {number} [timestampEndMs]
   *
   * @returns {ISummaries}
   */
  async getSummary(
    timestampStartMs?: number,
    timestampEndMs?: number
  ): Promise<ISummaries> {
    //  Transform ms to s
    const timestampStartS = timestampStartMs
      ? timestampStartMs / 1000
      : undefined;
    const timestampEndS = timestampEndMs ? timestampEndMs / 1000 : undefined;

    // Get blocks
    const blocks = await blockService.findAll(timestampStartS, timestampEndS);

    // Calculate
    let summaries: ISummaries = {};
    for (const block of blocks) {
      if (!block.timestamp) continue;

      // Block date
      const blockDate = new Date(block.timestamp * 1000);

      // Block day start
      const blockDateDayStart = this.getDateStartOfTheDay(blockDate);

      // Add Block To Day Summary
      summaries[blockDateDayStart.getTime()] = this.addBlockToDaySummary(
        block,
        summaries[blockDateDayStart.getTime()]
      );
    }

    return summaries;
  }

  /**
   * Get Day Date Start
   *
   * @param {Date} date
   *
   * @returns {Date}
   */
  getDateStartOfTheDay(date: Date): Date {
    const dayDateStart = new Date(date);
    dayDateStart.setHours(0);
    dayDateStart.setMinutes(0);
    dayDateStart.setSeconds(0);
    dayDateStart.setMilliseconds(0);
    return dayDateStart;
  }

  /**
   * Add block to day summary
   *
   * @param {BlockDto} block
   * @param {IDaySummary} daySummary
   *
   * @returns {IDaySummary}
   */
  private addBlockToDaySummary(
    block: BlockDto,
    daySummary?: IDaySummary
  ): IDaySummary {
    daySummary = daySummary ?? {};
    daySummary.blocks = (daySummary.blocks ?? 0) + 1;
    daySummary.gas = BigNumber.from(daySummary.gas ?? "0")
      .add(BigNumber.from(block.gasUsed))
      .toString();
    return daySummary;
  }
}

export default new SummaryHelper();
