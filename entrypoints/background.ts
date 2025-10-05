import { getLastestBlockhash } from "@/utils/blockchain-utils";
import { MessageType } from "@/utils/messages";

export default defineBackground(async () => {
  console.log("Hello background!", { id: browser.runtime.id });

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case MessageType.GET_PARSED_TX:
        (async () => {
          const url = await getCurrentTabUrl();
          if (!url) {
            sendResponse(null);
            return;
          }

          const txSig = getTxSigFromUrl(url);
          const parsedTx = await getParsedTx(txSig);
          sendResponse(parsedTx);
        })();
        break;

      case MessageType.GET_LATEST_BLOCKHASH:
        (async () => {
          const blockhash = await handleGetLatestBlockhash();
          if (!blockhash) {
            sendResponse(null);
            return;
          }

          sendResponse(blockhash);
        })();
        break;
    }

    return true;
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
  const { data: blockhash, error } = await getLastestBlockhash();
  if (error || !blockhash) {
    console.error(error || "Failed to get latest blockhash");
    return null;
  }
  return blockhash;
};
