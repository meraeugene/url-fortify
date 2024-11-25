// Helper function to check if the url is valid
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper function to trim the URL to its base domain
export const trimUrl = (url: string): string => {
  try {
    const { protocol, hostname } = new URL(url);
    return `${protocol}//${hostname}`;
  } catch {
    return url; // Fallback to the original URL if parsing fails
  }
};

// Helper function to encode the URL using base64
export const base64EncodeUrl = (url: string): string => {
  return btoa(url).replace(/=+$/, "");
};

// Helper function to clean extracted text and extract the first URL
export const extractUrl = (text: string) => {
  const cleanedText = text
    .replace(/\s+/g, " ") // Normalize spaces and newlines
    .replace(/([a-zA-Z0-9.-]+\/)\s+([a-zA-Z0-9-]+)/g, "$1$2"); // Merge split URLs

  // Regex to extract URL and ignore image extensions like .png, .jpg, .jpeg, etc.
  const urlRegex =
    /\b((https?:\/\/)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,6})(\/[^\s]*?)(?=\s|$|\.(?!\w{3,4}))\b/g;

  const match = cleanedText.match(urlRegex);
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
