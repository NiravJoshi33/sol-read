// Helius Enhanced Transaction API Response Types

export interface RawTokenAmount {
  tokenAmount: string;
  decimals: number;
}

export interface NativeTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
}

export interface TokenTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  fromTokenAccount: string;
  toTokenAccount: string;
  tokenAmount: number;
  mint: string;
}

export interface TokenBalanceChange {
  userAccount: string;
  tokenAccount: string;
  mint: string;
  rawTokenAmount: RawTokenAmount;
}

export interface AccountData {
  account: string;
  nativeBalanceChange: number;
  tokenBalanceChanges: TokenBalanceChange[];
}

export interface TransactionError {
  error: string;
}

export interface InnerInstruction {
  accounts: string[];
  data: string;
  programId: string;
}

export interface Instruction {
  accounts: string[];
  data: string;
  programId: string;
  innerInstructions: InnerInstruction[];
}

export interface NFT {
  mint: string;
  tokenStandard: string;
}

export interface NFTEvent {
  description: string;
  type: string;
  source: string;
  amount: number;
  fee: number;
  feePayer: string;
  signature: string;
  slot: number;
  timestamp: number;
  saleType: string;
  buyer: string;
  seller: string;
  staker: string;
  nfts: NFT[];
}

export interface NativeInput {
  account: string;
  amount: string;
}

export interface NativeOutput {
  account: string;
  amount: string;
}

export interface TokenInput {
  userAccount: string;
  tokenAccount: string;
  mint: string;
  rawTokenAmount: RawTokenAmount;
}

export interface TokenOutput {
  userAccount: string;
  tokenAccount: string;
  mint: string;
  rawTokenAmount: RawTokenAmount;
}

export interface TokenFee {
  userAccount: string;
  tokenAccount: string;
  mint: string;
  rawTokenAmount: RawTokenAmount;
}

export interface NativeFee {
  account: string;
  amount: string;
}

export interface InnerSwapTokenTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  fromTokenAccount: string;
  toTokenAccount: string;
  tokenAmount: number;
  mint: string;
}

export interface InnerSwapNativeTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
}

export interface ProgramInfo {
  source: string;
  account: string;
  programName: string;
  instructionName: string;
}

export interface InnerSwap {
  tokenInputs: InnerSwapTokenTransfer[];
  tokenOutputs: InnerSwapTokenTransfer[];
  tokenFees: InnerSwapTokenTransfer[];
  nativeFees: InnerSwapNativeTransfer[];
  programInfo: ProgramInfo;
}

export interface SwapEvent {
  nativeInput: NativeInput;
  nativeOutput: NativeOutput;
  tokenInputs: TokenInput[];
  tokenOutputs: TokenOutput[];
  tokenFees: TokenFee[];
  nativeFees: NativeFee[];
  innerSwaps: InnerSwap[];
}

export interface CompressedEvent {
  type: string;
  treeId: string;
  assetId: string;
  leafIndex: number;
  instructionIndex: number;
  innerInstructionIndex: number;
  newLeafOwner: string;
  oldLeafOwner: string;
}

export interface DistributeCompressionRewardsEvent {
  amount: number;
}

export interface SetAuthorityEvent {
  account: string;
  from: string;
  to: string;
  instructionIndex: number;
  innerInstructionIndex: number;
}

export interface Events {
  nft?: NFTEvent;
  swap?: SwapEvent;
  compressed?: CompressedEvent;
  distributeCompressionRewards?: DistributeCompressionRewardsEvent;
  setAuthority?: SetAuthorityEvent;
}

export interface EnhancedTransaction {
  description: string;
  type: string;
  source: string;
  fee: number;
  feePayer: string;
  signature: string;
  slot: number;
  timestamp: number;
  nativeTransfers: NativeTransfer[];
  tokenTransfers: TokenTransfer[];
  accountData: AccountData[];
  transactionError?: TransactionError;
  instructions: Instruction[];
  events: Events;
}

export type GetEnhancedTransactionsResponse = EnhancedTransaction[];

export interface GetEnhancedTransactionsRequest {
  transactions: string[];
  commitment?: "finalized" | "confirmed";
}
