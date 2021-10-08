import { ethers } from "ethers";
import BlockService from "../block/block.service";

export const EthereumEventNameBlock = "block";

class NetworkHelper {
  private provider: ethers.providers.BaseProvider;

  constructor() {
    this.provider = ethers.getDefaultProvider();
  }

  /**
   * Get Block
   */
  async getBlock(num: number): Promise<ethers.providers.Block | null> {
    return await this.provider.getBlock(num);
  }

  /**
   * Get Last Block Number
   */
  async getLastBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  /**
   * Observe Blocks
   */
  async observeBlocks() {
    this.provider.on(EthereumEventNameBlock, this.blocksListener);
  }

  /**
   * Blocks Listener
   */
  private async blocksListener(blockNumber: number): Promise<void> {
    const block = await this.getBlock(blockNumber);
    if (block) {
      /**
       * Store to the DB
       */
      await BlockService.create({
        hash: block.hash,
        parentHash: block.parentHash,
        number: block.number,
        timestamp: block.timestamp,
        gasUsed: block.gasUsed.toString(),
      });
    }
    console.log(`New block saved: #${blockNumber}.`);
  }

  /**
   * Stop Observing Blocks
   */
  async stopObservingBlocks() {
    this.provider.off(EthereumEventNameBlock);
  }
}

export default new NetworkHelper();