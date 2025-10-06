import { FormattedTx, TransactionParser } from "@/utils/tx-parser";
import { GetEnhancedTransactionsResponse } from "@/utils/types/helius";
import { MessageType } from "@/utils/types/messages";
import { useState } from "react";

const useGetParsedTransaction = () => {
  const [formattedTx, setFormattedTx] = useState<FormattedTx | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getParsedTransaction = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: GetEnhancedTransactionsResponse | null =
        await browser.runtime.sendMessage({
          type: MessageType.GET_PARSED_TX,
          payload: {},
        });

      setFormattedTx(TransactionParser.parseTx(response));
    } catch (error) {
      setError(error as string);
    }
    setIsLoading(false);
    return;
  };

  return { formattedTx, isLoading, error, getParsedTransaction };
};

export default useGetParsedTransaction;
