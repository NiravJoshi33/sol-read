import { CircleCheck, CircleX } from "lucide-react";

const ConnectionStatus = ({ connected }: { connected: boolean }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
      <div className="flex flex-row items-center justify-center h-full gap-2 w-full">
        {connected ? <CircleCheck color="green" /> : <CircleX color="red" />}
        <span className="text-md font-bold">
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>
    </div>
  );
};

export default ConnectionStatus;
