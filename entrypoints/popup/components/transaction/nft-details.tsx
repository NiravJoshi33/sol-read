import { NFTEvent } from "@/utils/types/helius";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAmount, formatAddress } from "@/utils/general";
import { Image } from "lucide-react";

const NftDetails = ({ nft }: { nft: NFTEvent }) => {
  if (!nft) return null;

  return (
    <Card className="bg-purple-50 border-purple-200">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-900"
            >
              {nft.type.replace("NFT_", "").replace("_", " ")}
            </Badge>
            {nft.amount && (
              <div className="text-2xl font-bold text-purple-900">
                {formatAmount(nft.amount.toString(), 9)} SOL
              </div>
            )}
          </div>
          <Image className="text-purple-400 h-8 w-8" />
        </div>

        {(nft.buyer || nft.seller) && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {nft.buyer && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Buyer</div>
                <div className="font-mono text-sm font-medium">
                  {formatAddress(nft.buyer)}
                </div>
              </div>
            )}
            {nft.seller && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Seller</div>
                <div className="font-mono text-sm font-medium">
                  {formatAddress(nft.seller)}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NftDetails;
