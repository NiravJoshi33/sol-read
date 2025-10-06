export const formatAmount = (amount: string, decimals: number = 9) => {
  const value = parseFloat(amount) / Math.pow(10, decimals);
  if (value < 0.000001) return value.toExponential(2);
  if (value < 1) return value.toFixed(6);
  return value.toFixed(4);
};

export const formatAddress = (address: string | null) => {
  if (!address) return "Unknown Address";
  return address.slice(0, 4) + "..." + address.slice(-4);
};

export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};
