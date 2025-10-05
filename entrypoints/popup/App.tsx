import { useEffect, useState } from "react";
import "./App.css";
import { MessageType } from "@/utils/types/messages";
import ConnectionStatus from "./components/connection-status";
import ApiKeyDialog from "./components/api-key-dialog";

function App() {
  const [parsedTx, setParsedTx] = useState<any>(null);
  const [blockhash, setBlockhash] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const getLastestBlockhash = async () => {
    const response: string | null = await browser.runtime.sendMessage({
      type: MessageType.GET_LATEST_BLOCKHASH,
      payload: {},
    });
    setBlockhash(response);
  };
  const getParsedTx = async () => {
    console.log("Getting parsed tx from popup");
    const response = await browser.runtime.sendMessage({
      type: MessageType.GET_PARSED_TX,
      payload: {},
    });
    console.log("Response:", response);
    setParsedTx(response);
  };

  const checkApiKey = async () => {
    const response = await browser.runtime.sendMessage({
      type: MessageType.CHECK_API_KEY,
      payload: {},
    });
    console.log("Response:", response);
    setConnected(response);
  };

  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKeyForm, setShowApiKeyForm] = useState<boolean>(false);

  useEffect(() => {
    if (connected) {
      setShowApiKeyForm(false);
      return;
    }
    checkApiKey();
    setShowApiKeyForm(true);
  }, [connected]);

  const handleSetApiKey = () => {
    // send message to background to set api key
    browser.runtime.sendMessage({
      type: MessageType.SET_API_KEY,
      payload: { apiKey },
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 min-w-64 min-h-128">
        <h1 className="text-6xl font-bold">SolRead</h1>
        <div className="flex flex-row gap-4 justify-between w-full items-center">
          <ConnectionStatus connected={connected} />
          {!connected && (
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
