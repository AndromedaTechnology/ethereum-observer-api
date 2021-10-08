import { BlockDto } from "./block.model";
import blockService from "./block.service";

class BlockSeed {
  /**
   * Blocks to be seeded
   */
  blocks: Array<BlockDto> = [
    {
      hash:
        "0xc5b4d1bfb5d1a17dd75365ad8ce5f670c97733a9e60b90da24bbae6368ef8eb4",
      parentHash:
        "0xb362b928cc03dc90d69a0e9653d18cad954cdb52a1b77dd1ca207013b87121cd",
      number: 13375054,
      timestamp: 1633653607,
      gasUsed: "20783885",
    },
  ];

  async seed() {
    for (const block of this.blocks) {
      await blockService.create(block);
    }
  }
}

export default new BlockSeed();
