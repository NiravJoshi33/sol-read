import { envVars } from "./env-vars";
import {
  GetLatestBlockhashResponse,
  RpcResponseData,
} from "./types/rpc-response";

export const getLastestBlockhash = async (apiKey: string) => {
  try {
    const response = await fetch(
      `${envVars.VITE_HELIUS_RPC_URL}?api-key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getLatestBlockhash",
          params: [
            {
              commitment: "confirmed",
              minContextSlot: 1000,
            },
          ],
        }),
      }
    );

    const data: RpcResponseData<GetLatestBlockhashResponse> =
      await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return { data: data.result.value.blockhash, error: null };
  } catch (error) {
    return {
      data: null,
      error: new Error("Failed to get latest blockhash", { cause: error }),
    };
  }
};
