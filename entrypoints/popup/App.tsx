import { useEffect, useState } from "react";
import "./App.css";
import { MessageType } from "@/utils/types/messages";
import ConnectionStatus from "./components/connection-status";
import ApiKeyDialog from "./components/api-key-dialog";
import useCheckConnection from "./hooks/use-check-connection";
import { toast, Toaster } from "sonner";
import TransactionCard from "./components/transaction/tx-card";
import { Button } from "@/components/ui/button";
import useGetParsedTransaction from "./hooks/use-get-parsed-tx";
import { Download, Loader2 } from "lucide-react";

function App() {
  const { connected, isLoading, error, checkConnection } = useCheckConnection();
  const {
    formattedTx,
    isLoading: isLoadingFormattedTx,
    error: errorFormattedTx,
    getParsedTransaction,
  } = useGetParsedTransaction();

  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    checkConnection();
  }, []);

  useEffect(() => {
    if (isLoadingFormattedTx) {
      toast.dismiss();
      toast.loading("Loading transaction...");
    } else if (errorFormattedTx) {
      toast.dismiss();
      toast.error(errorFormattedTx);
    } else if (formattedTx) {
      toast.dismiss();
      toast.success("Transaction loaded successfully");
    }
  }, [isLoadingFormattedTx, errorFormattedTx, formattedTx]);

  const handleSetApiKey = () => {
    // send message to background to set api key
    browser.runtime.sendMessage({
      type: MessageType.SET_API_KEY,
      payload: { apiKey },
    });

    checkConnection();

    toast.success("API key set successfully");
  };

  return (
    <>
      <Toaster />
      <div className="flex flex-col items-center justify-center gap-4 w-full min-h-128 px-2">
        <h1 className="text-6xl font-bold">SolRead</h1>
        <div className="flex flex-row gap-4 justify-center w-full items-center">
          <ConnectionStatus connected={connected} isLoading={isLoading} />
          {!connected && !isLoading && (
            <ApiKeyDialog
              apiKey={apiKey || ""}
              onChange={setApiKey}
              onSave={handleSetApiKey}
            />
          )}
        </div>

        {formattedTx ? (
          <TransactionCard txData={formattedTx} />
        ) : (
          <div>
            <Button
              onClick={() => getParsedTransaction()}
              className="w-full"
              disabled={isLoadingFormattedTx || isLoading}
            >
              {isLoadingFormattedTx ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Download />
              )}
              {isLoadingFormattedTx ? "Loading..." : "Get Transaction"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
