export enum MessageType {
  GET_PARSED_TX = "GET_PARSED_TX",
  GET_LATEST_BLOCKHASH = "GET_LATEST_BLOCKHASH",
}

export interface Message<T> {
  type: MessageType;
  payload: T;
}
