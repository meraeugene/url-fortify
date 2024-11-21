export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const base64EncodeUrl = (url: string): string => {
  return btoa(url).replace(/=+$/, "");
};
