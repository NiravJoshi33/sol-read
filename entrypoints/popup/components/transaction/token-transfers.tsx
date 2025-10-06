import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatAddress } from "@/utils/general";
import { FormattedTx } from "@/utils/tx-parser";
import { ArrowRight } from "lucide-react";

const TokenTransfers = ({ txData }: { txData: FormattedTx }) => {
  if (!txData || !txData.tokenTransfers || txData.tokenTransfers.length === 0)
    return null;

  return (
    <div className="space-y-3 mt-6">
      <div className="text-sm font-medium text-muted-foreground">
        Token Transfers
      </div>
      <div className="space-y-2">
        {txData.tokenTransfers.map((transfer, idx) => (
          <Card key={idx} className="bg-amber-50 border-amber-200">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-amber-900">
                  {formatAddress(transfer.mint)}
                </span>
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-900"
                >
                  {transfer.tokenAmount}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatAddress(transfer.fromUserAccount)}</span>
                <ArrowRight className="h-3 w-3" />
                <span>{formatAddress(transfer.toUserAccount)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TokenTransfers;
