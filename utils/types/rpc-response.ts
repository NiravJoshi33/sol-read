export interface RpcResponseData<T> {
  jsonrpc: string;
  id: number;
  error?: {
    code: number;
    message: string;
  };
  result: T;
}

export interface GetLatestBlockhashResponse {
  context: {
    slot: number;
  };
  value: {
    blockhash: string;
    lastValidBlockHeight: number;
  };
}
