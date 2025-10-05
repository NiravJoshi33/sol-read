export const heliusApiKey = import.meta.env.VITE_HELIUS_API_KEY;
if (!heliusApiKey) {
  throw new Error("HELIUS_API_KEY is not set");
  // TODO: get if from user
}

export const testConnection = async () => {};
