import { CircleCheck, CircleX, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useEffect } from "react";

interface ConnectionStatusProps {
  connected: boolean;
  isLoading: boolean;
}

const ConnectionStatus = (props: ConnectionStatusProps) => {
  const { connected, isLoading } = props;

  useEffect(() => {
    // if connected is false and isLoading is false, show toast
    if (!connected && !isLoading) {
      toast.error("Please add a valid API key", {
        duration: 3000,
        position: "top-center",
      });
    }
  }, [connected, isLoading]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
      <Badge
        className="flex flex-row items-center justify-center h-full gap-2"
        variant={connected || isLoading ? "secondary" : "destructive"}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : connected ? (
          <CircleCheck color="green" />
        ) : (
          <CircleX color="white" />
        )}
        <span className="text-md font-bold">
          {isLoading
            ? "Checking API Key..."
            : connected
            ? "Connected"
            : "Disconnected"}
        </span>
      </Badge>
    </div>
  );
};

export default ConnectionStatus;
