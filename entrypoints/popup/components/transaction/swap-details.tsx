import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SwapEvent } from "@/utils/types/helius";
import { formatAmount, formatAddress } from "@/utils/general";

const SwapDetails = ({ swap }: { swap: SwapEvent }) => {
  if (!swap) return null;
  console.log("swap", swap);

  const tokenInput = swap.tokenInputs?.[0];
  const nativeInput = swap.nativeInput;

  const tokenOutput = swap.tokenOutputs?.[0];
  const nativeOutput = swap.nativeOutput;

  const inputAmount = tokenInput
    ? formatAmount(
        tokenInput.rawTokenAmount.tokenAmount,
        tokenInput.rawTokenAmount.decimals
      )
    : nativeInput
    ? formatAmount(nativeInput.amount, 9)
    : "0";

  const inputMint = tokenInput?.mint || null;

  // Format output
  const outputAmount = tokenOutput
    ? formatAmount(
        tokenOutput.rawTokenAmount.tokenAmount,
        tokenOutput.rawTokenAmount.decimals
      )
    : nativeOutput
    ? formatAmount(nativeOutput.amount, 9)
    : "0";

  const outputMint = tokenOutput?.mint || null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="text-xs text-red-600 font-medium mb-2">
              You Paid
            </div>
            <div className="text-2xl font-bold text-red-900">{inputAmount}</div>
            <div className="text-sm text-red-600 mt-1">
              {inputMint ? formatAddress(inputMint) : "SOL"}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <ArrowRight className="text-muted-foreground h-6 w-6" />
        </div>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-xs text-green-600 font-medium mb-2">
              You Received
            </div>
            <div className="text-2xl font-bold text-green-900">
              {outputAmount}
            </div>
            <div className="text-sm text-green-600 mt-1">
              {outputMint ? formatAddress(outputMint) : "SOL"}
            </div>
          </CardContent>
        </Card>
      </div>

      {swap.tokenFees?.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Trading fee:</span>
          <Badge variant="outline">
            {formatAmount(
              swap.tokenFees[0].rawTokenAmount?.tokenAmount ||
                swap.tokenFees[0].rawTokenAmount?.tokenAmount,
              swap.tokenFees[0].rawTokenAmount?.decimals || 9
            )}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default SwapDetails;
