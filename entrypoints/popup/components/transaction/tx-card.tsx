import {
  Database,
  DollarSign,
  Plus,
  Repeat,
  Send,
  ShoppingCart,
} from "lucide-react";
import { FormattedTx } from "@/utils/tx-parser";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAddress, formatAmount, formatTime } from "@/utils/general";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Check,
  Copy,
} from "lucide-react";
import SwapDetails from "./swap-details";
import NftDetails from "./nft-details";
import TokenTransfers from "./token-transfers";
import TransferDetails from "./transfer-details";
import useCopyAddress from "../../hooks/use-copy-address";
import { useState } from "react";

const TransactionCard = ({ txData }: { txData: FormattedTx }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { copiedAddress, copyAddress } = useCopyAddress();
  const getTransactionIcon = (txType: string) => {
    const iconMap = {
      SWAP: Repeat,
      NFT_SALE: ShoppingCart,
      NFT_BID: DollarSign,
      NFT_MINT: Plus,
      TRANSFER: Send,
      COMPRESSED: Database,
    };

    for (const key in iconMap) {
      if (txType?.includes(key)) {
        return iconMap[key as keyof typeof iconMap];
      }
    }

    return Send;
  };

  const Icon = getTransactionIcon(txData.type);

  return (
    <Card className="w-full shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg py-2">
        <div className="flex items-center justify-center gap-2">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0 break-words max-w-[280px]">
            <CardTitle className="text-base mb-1 break-words text-wrap whitespace-normal leading-tight">
              {txData.description || "Solana Transaction"}
            </CardTitle>
            <CardDescription className="text-purple-100 text-sm">
              {formatTime(txData.timestamp)}
            </CardDescription>
          </div>
          {txData.source && (
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30 flex-shrink-0 whitespace-nowrap text-xs"
            >
              {txData.source}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Transaction Error */}
        {txData.transactionError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Transaction Failed</AlertTitle>
            <AlertDescription>{txData.transactionError.error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        {txData.events?.swap && SwapDetails({ swap: txData.events.swap })}
        {txData.events?.nft && NftDetails({ nft: txData.events.nft })}
        {!txData.events?.swap &&
          !txData.events?.nft &&
          TransferDetails({ txData })}
        {TokenTransfers({ txData })}

        <Separator className="my-6" />

        {/* Technical Details */}
        <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full">
              <span className="flex items-center gap-2">
                {detailsOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Technical Details
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-4 bg-muted/50">
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Fee</span>
                  <Badge variant="outline">
                    {formatAmount((txData.fee || 0).toString(), 9)} SOL
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Fee Payer
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      {formatAddress(txData.feePayer || null)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyAddress(txData.feePayer || "")}
                    >
                      {copiedAddress === txData.feePayer ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Slot</span>
                  <span className="font-mono text-sm">
                    {txData.slot?.toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Signature
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-background rounded border">
                    <span className="font-mono text-xs break-all flex-1">
                      {txData.signature}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={() => copyAddress(txData.signature || "")}
                    >
                      {copiedAddress === txData.signature ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
