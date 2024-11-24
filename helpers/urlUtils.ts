// Helper function to check if the url is valid
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper function to encode the URL using base64
export const base64EncodeUrl = (url: string): string => {
  return btoa(url).replace(/=+$/, "");
};

// Helper function to extract the first URL from text
export const extractFirstUrl = (text: string) => {
  const urlRegex =
    /\b((https?:\/\/)?[a-zA-Z][a-zA-Z0-9-]*\.[a-zA-Z]{2,6})(\/[^\s]*)?\b/g;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
};

// Helper function to format the URL
export const formatUrl = (url: string) => {
  // Fix incomplete protocols and ensure the URL starts with http:// or https://
  if (/^https?:\/\//.test(url)) {
    return url; // Already has a valid protocol
  } else {
    return `http://${url}`; // Prepend http:// if missing
  }
};
