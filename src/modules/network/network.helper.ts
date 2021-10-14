import { ethers } from "ethers";

import config from "../../config/index";
import BlockService from "../block/block.service";

/**
 * DailySummary
 */
export interface IDailySummary {
  blocks: string;
  gas: string;
}

/**
 * Ethereum EventName Block
 */
export const EthereumEventNameBlock = "block";

/**
 * Contract Interface
 */
export const contractInterface = [
  "function getCreator() public view returns (address)",
  "function addSummary(uint256 dayId, uint256 blocks, uint256 gas) public",
  "function getSummary(uint256 dayId) public view returns (tuple(uint256 blocks, uint256 gas) summary)",
];

/**
 * NetworkHelper
 */
class NetworkHelper {
  /**
   * Provider
   */
  private provider: ethers.providers.BaseProvider;
  /**
   * Signer
   *
   * Used to sign transactions.
   */
  private signer: ethers.Wallet | null = null;
  /**
   * Contract
   */
  private contract: ethers.Contract | null = null;

  /**
   * Constructor
   */
  constructor() {
    this.provider = ethers.getDefaultProvider(config.ethereum_network_name);
    this.signer = this.constructSigner(
      this.provider,
      config.ethereum_private_key
    );
    this.contract = this.constructContract(
      this.provider,
      this.signer ?? undefined,
      config.ethereum_contract_address,
      contractInterface
    );
  }

  /**
   * Get Contract state
   */
  async getContractState(dayId: number): Promise<IDailySummary | null> {
    if (!this.contract) return null;
    const val = await this.contract.getSummary(dayId);
    console.info("--GetContractState", val);
    // https://ethereum.stackexchange.com/questions/89423/convert-hex-number-from-solidity/89430
    return {
      blocks: val[0].toString(),
      gas: val[1].toString(),
    };
  }

  /**
   * Update Contract state
   */
  async updateContractState(
    dayId: number,
    blocks: number,
    gas: number
  ): Promise<any> {
    if (!this.contract) return;
    const res = await this.contract.addSummary(dayId, blocks, gas);
    console.info("--UpdateContractState", dayId, blocks, gas, res);
    return res;
  }

  /**
   * Init Signer
   */
  private constructSigner(
    provider?: ethers.providers.BaseProvider,
    privateKey?: string
  ): ethers.Wallet | null {
    if (!provider) return null;
    if (!privateKey) return null;
    return new ethers.Wallet(privateKey, provider);
  }

  /**
   * Get Signer
   */
  getSigner(): ethers.Wallet | null {
    return this.signer;
  }

  /**
   * Init Contract
   *
   * If signer is not available: provider will be used
   * (could be because private key was not provided in .env).
   */
  private constructContract(
    provider?: ethers.providers.BaseProvider,
    signer?: ethers.Wallet,
    contractAddress?: string,
    contractInterface?: Array<any>
  ): ethers.Contract | null {
    if (!signer) return null;
    if (!contractInterface) return null;
    if (!contractAddress) return null;
    return new ethers.Contract(
      contractAddress,
      contractInterface,
      signer ?? provider
    );
  }

  /**
   * Get Contract
   */
  getContract(): ethers.Contract | null {
    return this.contract;
  }

  /**
   * Get Block
   */
  async getBlock(num: number): Promise<ethers.providers.Block | null> {
    return await this.provider.getBlock(num);
  }

  /**
   * Get Network Name
   */
  async getNetworkName(): Promise<string> {
    const network = await this.provider.getNetwork();
    return network.name;
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
