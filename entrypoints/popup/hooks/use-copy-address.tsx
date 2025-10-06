import { useState } from "react";

const useCopyAddress = () => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);

    setTimeout(() => {
      setCopiedAddress(null);
    }, 2000);
  };

  return { copiedAddress, copyAddress };
};

export default useCopyAddress;
