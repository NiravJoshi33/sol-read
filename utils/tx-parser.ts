import {
  AccountData,
  CompressedEvent,
  EnhancedTransaction,
  Events,
  GetEnhancedTransactionsResponse,
  NativeTransfer,
  NFTEvent,
  SwapEvent,
  TokenTransfer,
  TransactionError,
} from "@/utils/types/helius";
import { knownTokens } from "@/utils/known-tokens";

export interface FormattedTx {
  signature: string;
  timestamp: number;
  slot?: number;
  fee?: number;
  feePayer?: string;
  description: string;
  type: string;
  source?: string;
  nativeTransfers?: NativeTransfer[];
  tokenTransfers?: TokenTransfer[];
  events?: Events;
  accounData?: AccountData[];
  transactionError?: TransactionError | null;
  success: boolean;
  uiConfig: {
    iconType: string;
    colorScheme: string;
    actionSummary: {
      action: string;
      from?: string;
      fromToken?: string;
      to?: string;
      toToken?: string;
      amount?: string;
      currency?: string;
    };
    keyStats: { label: string; value: string; unit?: string }[];
    isComplex: boolean;
    participants: string[];
  };
}

export class TransactionParser {
  static parseTx(
    response: GetEnhancedTransactionsResponse | null
  ): FormattedTx {
    if (!response || response.length === 0) {
      return this.createUnknownTx();
    }

    const enhancedTx = response[0];
    return {
      signature: enhancedTx.signature,
      timestamp: enhancedTx.timestamp,
      slot: enhancedTx.slot,
      fee: enhancedTx.fee,
      feePayer: enhancedTx.feePayer,
      description:
        enhancedTx.description || this.generateDescription(enhancedTx),
      type: enhancedTx.type,
      source: enhancedTx.source,
      nativeTransfers: enhancedTx.nativeTransfers || [],
      tokenTransfers: enhancedTx.tokenTransfers || [],
      events: enhancedTx.events || {},
      accounData: enhancedTx.accountData || [],
      transactionError: enhancedTx.transactionError || null,
      success: !enhancedTx.transactionError,
      uiConfig: this.deriveUIMedadata(enhancedTx),
    };
  }

  static generateDescription(tx: EnhancedTransaction) {
    if (tx.events?.swap) {
      return this.describeSwap(tx.events.swap);
    }

    if (tx.events?.nft) {
      return this.describeNFT(tx.events.nft);
    }

    if (tx.events?.compressed) {
      return this.describeCompressed(tx.events.compressed);
    }

    if (tx.nativeTransfers?.length > 1) {
      return `Distributed SOL to ${tx.nativeTransfers.length} addresses`;
    }

    if (tx.nativeTransfers?.length === 1) {
      return "SOL Transfer";
    }

    if (tx.tokenTransfers?.length > 1) {
      return `Token distribution to ${tx.tokenTransfers.length} addresses`;
    }

    if (tx.tokenTransfers?.length === 1) {
      return "Token Transfer";
    }

    return "Solana Transaction";
  }

  static describeSwap(swap: SwapEvent) {
    const inputToken = this.getTokenSymbol(swap.tokenInputs[0].mint);
    const outputToken = this.getTokenSymbol(swap.tokenOutputs[0].mint);
    if (inputToken && outputToken) {
      return `Swap ${inputToken} for ${outputToken}`;
    }

    return "Token Swap";
  }

  static describeNFT(nft: NFTEvent) {
    const action = nft.type.replace("NFT_", "").toLowerCase().replace("_", " ");
    return `NFT ${action}`;
  }

  static describeCompressed(compressed: CompressedEvent) {
    const type = compressed.type.replace(/_/g, " ").toLowerCase();
    return `Compressed NFT: ${type}`;
  }

  static deriveUIMedadata(tx: EnhancedTransaction) {
    return {
      iconType: this.determineIconType(tx),
      colorScheme: this.determineColorScheme(tx),
      actionSummary: this.getActionSummary(tx),
      keyStats: this.extractKeyStats(tx),
      isComplex: this.isComplexTx(tx),
      participants: this.extractParticipants(tx),
    };
  }

  static determineIconType(tx: EnhancedTransaction) {
    if (tx.type?.includes("SWAP")) return "swap";
    if (tx.type?.includes("NFT")) return "nft";
    if (tx.type?.includes("COMPRESSED")) return "compressed";
    if (tx.nativeTransfers?.length > 1 || tx.tokenTransfers?.length > 1)
      return "distribute";
    return "transfer";
  }

  static determineColorScheme(tx: EnhancedTransaction) {
    if (tx.transactionError) return "red";
    if (tx.events?.swap) return "green";
    if (tx.events?.nft) return "blue";
    return "gray";
  }

  static getActionSummary(tx: EnhancedTransaction) {
    if (tx.events?.swap) {
      const input = tx.events.swap.tokenInputs?.[0];
      const output = tx.events.swap.tokenOutputs?.[0];

      if (input && output) {
        return {
          action: "SWAP",
          from: this.formatAmount(
            input.rawTokenAmount?.tokenAmount || "0",
            input.rawTokenAmount?.decimals || 9
          ),
          fromToken: this.getTokenSymbol(input.mint),
          to: this.formatAmount(
            output.rawTokenAmount?.tokenAmount || "0",
            output.rawTokenAmount?.decimals || 9
          ),
          toToken: this.getTokenSymbol(output.mint),
        };
      }
    }

    if (tx.events?.nft) {
      return {
        action: tx.events.nft.type,
        amount: tx.events.nft.amount
          ? this.formatAmount(tx.events.nft.amount.toString(), 9)
          : undefined,
        currency: "SOL",
      };
    }

    return { action: "UNKNOWN" };
  }

  static extractKeyStats(tx: EnhancedTransaction) {
    const stats: { label: string; value: string; unit?: string }[] = [];

    if (tx.fee) {
      stats.push({
        label: "Fee",
        value: this.formatAmount(tx.fee.toString(), 9),
        unit: "SOL",
      });
    }

    if (tx.events?.swap) {
      const input = tx.events.swap.tokenInputs?.[0];
      const output = tx.events.swap.tokenOutputs?.[0];

      if (input && output) {
        const inputAmount = parseFloat(
          input.rawTokenAmount?.tokenAmount || "0"
        );
        const outputAmount = parseFloat(
          output.rawTokenAmount?.tokenAmount || "0"
        );
        const rate = outputAmount / inputAmount;

        stats.push({
          label: "Rate",
          value: rate.toFixed(6),
          unit: `${this.getTokenSymbol(output.mint)}/${this.getTokenSymbol(
            input.mint
          )}`,
        });
      }
    }

    return stats;
  }

  static isComplexTx(tx: EnhancedTransaction) {
    const hasMultipleEvents = Object.keys(tx.events || {}).length > 1;
    const hasMultipleTransfers =
      (tx.nativeTransfers?.length || 0) > 1 ||
      (tx.tokenTransfers?.length || 0) > 3;
    const hasInnerSwaps = (tx.events?.swap?.innerSwaps?.length || 0) > 0;

    return hasMultipleEvents || hasMultipleTransfers || hasInnerSwaps;
  }

  static extractParticipants(tx: EnhancedTransaction) {
    const participants = new Set<string>();

    tx.nativeTransfers.forEach((transfer) => {
      participants.add(transfer.fromUserAccount);
      participants.add(transfer.toUserAccount);
    });

    tx.tokenTransfers.forEach((transfer) => {
      participants.add(transfer.fromUserAccount);
      participants.add(transfer.toUserAccount);
    });

    // for nft events
    if (tx.events?.nft) {
      if (tx.events.nft.buyer) {
        participants.add(tx.events.nft.buyer);
      }
      if (tx.events.nft.seller) {
        participants.add(tx.events.nft.seller);
      }
    }

    // fee payer
    if (tx.feePayer) {
      participants.add(tx.feePayer);
    }

    return Array.from(participants);
  }

  static formatAmount(amount: string, decimals: number = 9) {
    if (!amount) return "0";

    const value = parseFloat(amount) / Math.pow(10, decimals);

    if (value < 0.000001) return value.toExponential(2);
    if (value < 0.001) return value.toFixed(6);
    if (value < 1) return value.toFixed(4);
    if (value < 1000) return value.toFixed(2);

    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  static getTokenSymbol(mint: string) {
    if (!mint) return "Unknown";

    return (
      knownTokens[mint as keyof typeof knownTokens] ||
      `${mint.slice(0, 4)}...${mint.slice(-4)}`
    );
  }

  static createUnknownTx() {
    return {
      signature: "unknown",
      timestamp: Math.floor(Date.now() / 1000),
      description: "Unknown transaction",
      type: "UNKNOWN",
      success: false,
      uiConfig: {
        iconType: "unknown",
        colorScheme: "gray",
        actionSummary: { action: "UNKNOWN" },
        keyStats: [],
        isComplex: false,
        participants: [],
      },
    };
  }
}
