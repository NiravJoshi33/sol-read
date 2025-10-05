import { CircleCheck, CircleX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ConnectionStatus = ({ connected }: { connected: boolean }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
      <Badge
        className="flex flex-row items-center justify-center h-full gap-2"
        variant={connected ? "secondary" : "destructive"}
      >
        {connected ? <CircleCheck color="green" /> : <CircleX color="white" />}
        <span className="text-md font-bold">
          {connected ? "Connected" : "Disconnected"}
        </span>
      </Badge>
    </div>
  );
};

export default ConnectionStatus;
