export enum MessageType {
  GET_PARSED_TX = "GET_PARSED_TX",
  GET_LATEST_BLOCKHASH = "GET_LATEST_BLOCKHASH",
  SET_API_KEY = "SET_API_KEY",
  CHECK_API_KEY = "CHECK_API_KEY",
}

export interface Message<T> {
  type: MessageType;
  payload: T;
}

export interface MessageResponse<T> {
  data: T;
  error: string | Error | null;
}
