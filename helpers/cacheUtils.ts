import { AnalysisData } from "@/types";

const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

// Helper: Retrieve cached data from sessionStorage
export const getCachedData = (url: string): AnalysisData | null => {
  try {
    const cached = sessionStorage.getItem(url);
    if (!cached) return null;

    const { data, expiration } = JSON.parse(cached);

    // If the cache is expired, return null
    if (Date.now() > expiration) {
      sessionStorage.removeItem(url); // Remove expired cache
      return null;
    }

    return data;
  } catch {
    return null;
  }
};

// Helper: Cache data into sessionStorage with expiration timestamp
export const cacheData = (url: string, data: AnalysisData) => {
  const expiration = Date.now() + CACHE_EXPIRATION_TIME;

  const cachedData = { data, expiration };
  sessionStorage.setItem(url, JSON.stringify(cachedData));
};
