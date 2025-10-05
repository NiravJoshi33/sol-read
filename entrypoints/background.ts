import { getLastestBlockhash } from "@/utils/blockchain-utils";
import { MessageType } from "@/utils/types/messages";
import { getApiKey, setApiKey } from "@/utils/manage-key";

export default defineBackground(async () => {
  console.log("Hello background!", { id: browser.runtime.id });

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case MessageType.GET_PARSED_TX:
        (async () => {
          try {
            const url = await getCurrentTabUrl();
            if (!url) {
              sendResponse(null);
              return;
            }

            const txSig = getTxSigFromUrl(url);
            const parsedTx = await getParsedTx(txSig);
            sendResponse(parsedTx);
          } catch (error) {
            console.error("Error getting parsed tx:", error);
            sendResponse(null);
          }
        })();
        return true;

      case MessageType.GET_LATEST_BLOCKHASH:
        (async () => {
          try {
            const apiKey = await getApiKey();
            if (!apiKey) {
              sendResponse(null);
              return;
            }
            const { data: blockhash, error } = await getLastestBlockhash(
              apiKey
            );
            if (error || !blockhash) {
              sendResponse(null);
              return;
            }

            sendResponse(blockhash);
          } catch (error) {
            console.error("Error getting latest blockhash:", error);
            sendResponse(null);
          }
        })();
        return true;

      case MessageType.SET_API_KEY:
        (async () => {
          try {
            await setApiKey(message.payload.apiKey);
            sendResponse(true);
          } catch (error) {
            console.error("Error setting API key:", error);
            sendResponse(false);
          }
        })();
        return true;

      case MessageType.CHECK_API_KEY:
        (async () => {
          try {
            console.log("Checking API key");
            const apiKey = await getApiKey();
            if (!apiKey) {
              sendResponse(false);
              return;
            }
            const { data: blockhash, error } = await getLastestBlockhash(
              apiKey
            );
            console.log("Blockhash:", blockhash);
            console.log("Error:", error);
            if (error || !blockhash) {
              sendResponse(false);
              return;
            }
            sendResponse(true);
          } catch (error) {
            console.error("Error checking API key:", error);
            sendResponse(false);
          }
        })();
        return true;

      default:
        sendResponse(null);
        return false;
    }
  });
});

const getCurrentTabUrl = async () => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (tabs.length > 0) {
    return tabs[0].url;
  }
  return null;
};

const getTxSigFromUrl = (url: string) => {
  // remove all params from the url
  const urlObj = new URL(url);
  urlObj.searchParams.forEach((value, key) => {
    urlObj.searchParams.delete(key);
  });

  // get the txSig from the url
  const sig = urlObj.href.split("/tx/")[1];
  return sig;
};

const getParsedTx = async (txSig: string) => {
  const response = await fetch(
    `https://api.helius.xyz/v0/transactions/?api-key=${
      import.meta.env.VITE_HELIUS_API_KEY
    }`,
    {
      method: "POST",
      body: JSON.stringify({
        transactions: [txSig],
      }),
    }
  );

  const data = await response.json();
  return data;
};

export const handleGetLatestBlockhash = async () => {
  const apiKey = await getApiKey();
  const { data: blockhash, error } = await getLastestBlockhash(apiKey || "");
  if (error || !blockhash) {
    console.error(error || "Failed to get latest blockhash");
    return null;
  }
  return blockhash;
};
