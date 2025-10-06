import { getLastestBlockhash } from "@/utils/blockchain-utils";
import { MessageType } from "@/utils/types/messages";
import { getApiKey, setApiKey } from "@/utils/manage-key";
import { GetEnhancedTransactionsResponse } from "@/utils/types/helius";
import { RpcResponseData } from "@/utils/types/rpc-response";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received:", message);
    switch (message.type) {
      case MessageType.GET_PARSED_TX:
        (async () => {
          try {
            const url = await getCurrentTabUrl();
            if (!url) {
              sendResponse({ data: null, error: "No URL found" });
              return;
            }

            const txSig = getTxSigFromUrl(url);
            if (!txSig) {
              sendResponse({
                data: null,
                error:
                  "No Transfer Signature found, Please make sure you are on a Solana transaction page",
              });
              return;
            }
            const parsedTx = await getParsedTx(txSig);
            sendResponse({ data: parsedTx, error: null });
          } catch (error) {
            console.error("Error getting parsed tx:", error);
            sendResponse({ data: null, error: error as string });
          }
        })();
        return true;

      case MessageType.GET_LATEST_BLOCKHASH:
        (async () => {
          try {
            const apiKey = await getApiKey();
            if (!apiKey) {
              sendResponse({ data: null, error: "No API key found" });
              return;
            }
            const { data: blockhash, error } = await getLastestBlockhash(
              apiKey
            );
            if (error || !blockhash) {
              sendResponse({ data: null, error: error });
              return;
            }

            sendResponse({ data: blockhash, error: null });
          } catch (error) {
            console.error("Error getting latest blockhash:", error);
            sendResponse({ data: null, error: error as string });
          }
        })();
        return true;

      case MessageType.SET_API_KEY:
        (async () => {
          try {
            await setApiKey(message.payload.apiKey);
            sendResponse({ data: true, error: null });
          } catch (error) {
            console.error("Error setting API key:", error);
            sendResponse({ data: false, error: error as string });
          }
        })();
        return true;

      case MessageType.CHECK_API_KEY:
        (async () => {
          try {
            console.log("Checking API key");
            const apiKey = await getApiKey();
            if (!apiKey) {
              console.log("No API key found");
              sendResponse({ data: false, error: "No API key found" });
              return;
            }
            const { data: blockhash, error } = await getLastestBlockhash(
              apiKey
            );
            console.log("Blockhash:", blockhash);
            console.log("Error:", error);
            if (error || !blockhash) {
              console.log("Error getting latest blockhash");
              sendResponse({ data: false, error: error });
              return;
            }
            sendResponse({ data: true, error: null });
          } catch (error) {
            console.error("Error checking API key:", error);
            sendResponse({ data: false, error: error as string });
          }
        })();
        return true;

      default:
        sendResponse({ data: null, error: "Invalid message type" });
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

  const data: GetEnhancedTransactionsResponse | RpcResponseData<null> =
    await response.json();

  if (Array.isArray(data)) {
    return data;
  } else {
    return null;
  }
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
