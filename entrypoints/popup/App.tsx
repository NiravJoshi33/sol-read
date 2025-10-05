import { useEffect, useState } from "react";
import "./App.css";
import { MessageType } from "@/utils/types/messages";
import ConnectionStatus from "./components/connection-status";

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

  const [apiKey, setApiKey] = useState<string | null>(null);
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
      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <h1 className="text-6xl font-bold">SolRead</h1>
        <ConnectionStatus connected={connected} />
      </div>
    </>
  );
}

export default App;
