const API_KEY_KEY = "userApiKey";

export const getApiKey = async (): Promise<string | undefined> => {
  if (typeof browser === "undefined" || !browser.storage) {
    return undefined;
  }
  const result = await browser.storage.local.get(API_KEY_KEY);
  return result[API_KEY_KEY];
};

export const setApiKey = async (apiKey: string): Promise<void> => {
  if (typeof browser === "undefined" || !browser.storage) {
    throw new Error("Browser storage is not available");
  }
  await browser.storage.local.set({ [API_KEY_KEY]: apiKey });
};
