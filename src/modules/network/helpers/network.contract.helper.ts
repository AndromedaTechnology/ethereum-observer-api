import { ethers } from "ethers";

import config from "../../../config/index";

/**
 * DailySummary
 */
export interface IDailySummary {
  blocks: string;
  gas: string;
}

/**
 * Contract Interface
 */
export const contractInterface = [
  "function getCreator() public view returns (address)",
  "function addSummary(uint256 dayId, uint256 blocks, uint256 gas) public",
  "function getSummary(uint256 dayId) public view returns (tuple(uint256 blocks, uint256 gas) summary)",
];

/**
 * NetworkContractHelper
 */
class NetworkContractHelper {
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
   * Get Signer
   */
  getSigner(): ethers.Wallet | null {
    return this.signer;
  }

  /**
   * Construct Signer
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
   * Get Contract
   */
  getContract(): ethers.Contract | null {
    return this.contract;
  }

  /**
   * Construct Contract
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
   * Get Contract state
   */
  async getContractState(dayId: number): Promise<IDailySummary | null> {
    if (!this.contract) return null;
    const val = await this.contract.getSummary(dayId);
    console.info("--GetContractState", val);
    // https://ethereum.stackexchange.com/questions/89423/convert-hex-number-from-solidity/89430
    return {
      blocks: val["blocks"].toString(),
      gas: val["gas"].toString(),
    };
  }

  /**
   * Update Contract state
   * TODO: gas: convert to string to support BigNumber (here, contract, contractInterface)
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
}

export default new NetworkContractHelper();
