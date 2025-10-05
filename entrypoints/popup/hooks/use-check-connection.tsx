import { MessageType } from "@/utils/types/messages";
import { useState } from "react";

const useCheckConnection = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    // add delay
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));

    setError(null);
    const response = await browser.runtime.sendMessage({
      type: MessageType.CHECK_API_KEY,
      payload: {},
    });
    setConnected(response);
    setIsLoading(false);
  };

  return { connected, isLoading, error, checkConnection };
};

export default useCheckConnection;
