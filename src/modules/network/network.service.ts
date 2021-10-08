import NetworkHelper from "./network.helper";

export interface INetworkStatus {
  message?: string;
  lastBlockNumber?: number;
}

export enum NetworkStatusMessage {
  CONNECTED = "Connected to Ethereum Network. Query other endpoints for logs.",
  DISCONNECTED = "Disconnected from Ethereum Network.",
}

class NetworkService {
  async create(isToObserve: boolean = true): Promise<INetworkStatus> {
    if (isToObserve) {
      NetworkHelper.observeBlocks();
    }
    const lastBlockNumber = await NetworkHelper.getLastBlockNumber();

    console.info(NetworkStatusMessage.CONNECTED);

    const val: INetworkStatus = {
      message: NetworkStatusMessage.CONNECTED,
      lastBlockNumber,
    };
    return val;
  }
  async delete(): Promise<INetworkStatus> {
    NetworkHelper.stopObservingBlocks();
    const lastBlockNumber = await NetworkHelper.getLastBlockNumber();

    console.info(NetworkStatusMessage.DISCONNECTED);

    const val: INetworkStatus = {
      message: NetworkStatusMessage.DISCONNECTED,
      lastBlockNumber,
    };
    return val;
  }
}

export default new NetworkService();
