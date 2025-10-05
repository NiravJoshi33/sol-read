import { useEffect, useState } from "react";
import "./App.css";
import { MessageType } from "@/utils/types/messages";
import ConnectionStatus from "./components/connection-status";
import ApiKeyDialog from "./components/api-key-dialog";
import useCheckConnection from "./hooks/use-check-connection";
import { toast, Toaster } from "sonner";

function App() {
  const { connected, isLoading, error, checkConnection } = useCheckConnection();

  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKeyForm, setShowApiKeyForm] = useState<boolean>(false);

  useEffect(() => {
    if (connected) {
      setShowApiKeyForm(false);
      return;
    }
    checkConnection();
    setShowApiKeyForm(true);
  }, [connected]);

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
      <div className="flex flex-col items-center justify-center gap-4 min-w-64 min-h-128">
        <h1 className="text-6xl font-bold">SolRead</h1>
        <div className="flex flex-row gap-4 justify-between w-full items-center">
          <ConnectionStatus connected={connected} isLoading={isLoading} />
          {!connected && !isLoading && (
            <ApiKeyDialog
              apiKey={apiKey || ""}
              onChange={setApiKey}
              onSave={handleSetApiKey}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
