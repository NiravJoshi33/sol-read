import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatAddress, formatAmount } from "@/utils/general";
import { Badge } from "@/components/ui/badge";
import { FormattedTx } from "@/utils/tx-parser";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
} from "lucide-react";
import useCopyAddress from "../../hooks/use-copy-address";

const TransferDetails = ({ txData }: { txData: FormattedTx }) => {
  const [expanded, setExpanded] = useState(false);
  const { copiedAddress, copyAddress } = useCopyAddress();

  if (!txData || !txData.nativeTransfers || txData.nativeTransfers.length === 0)
    return null;

  const transfers = txData.nativeTransfers;
  const isMultiTransfer = transfers.length > 1;

  if (isMultiTransfer) {
    const totalAmount = transfers.reduce((sum, t) => sum + t.amount, 0);

    return (
      <div className="space-y-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6 text-center">
            <div className="text-xs text-blue-600 font-medium mb-2">
              Total Distributed
            </div>
            <div className="text-3xl font-bold text-blue-900">
              {formatAmount(totalAmount.toString(), 9)} SOL
            </div>
            <Badge className="mt-2">to {transfers.length} recipients</Badge>
          </CardContent>
        </Card>

        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full">
              <span className="flex items-center gap-2">
                {expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                View all recipients
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ScrollArea className="h-60 rounded-md border p-4">
              <div className="space-y-2">
                {transfers.map((transfer, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-muted-foreground">
                        {formatAddress(transfer.toUserAccount)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyAddress(transfer.toUserAccount)}
                      >
                        {copiedAddress === transfer.toUserAccount ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <Badge variant="secondary">
                      {formatAmount(transfer.amount.toString(), 9)} SOL
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  // for single transfer
  const transfer = transfers[0];
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">From</div>
              <div className="font-mono text-sm font-medium">
                {formatAddress(transfer.fromUserAccount)}
              </div>
            </div>
            <ArrowRight className="text-muted-foreground h-4 w-4" />
            <div>
              <div className="text-xs text-muted-foreground mb-1">To</div>
              <div className="font-mono text-sm font-medium">
                {formatAddress(transfer.toUserAccount)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-center">
        <div className="text-3xl font-bold">
          {formatAmount(transfer.amount.toString(), 9)} SOL
        </div>
      </div>
    </div>
  );
};

export default TransferDetails;
