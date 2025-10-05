export enum MessageType {
  GET_PARSED_TX = "GET_PARSED_TX",
}

export interface Message<T> {
  type: MessageType;
  payload: T;
}
