import { MessageType } from "@/utils/types/messages";
import { useState } from "react";

const useCheckConnection = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    console.log("Checking connection");
    setIsLoading(true);

    setError(null);
    const response = await browser.runtime.sendMessage({
      type: MessageType.CHECK_API_KEY,
      payload: {},
    });
    console.log("Response:", response);
    setConnected(response);
    setIsLoading(false);
  };

  return { connected, isLoading, error, checkConnection };
};

export default useCheckConnection;
