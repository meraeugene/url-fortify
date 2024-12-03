// Represents the categories returned by the analysis, where each key is a provider name

// and the value is the category it assigned to the URL (e.g., "social networks").
export interface Categories {
  [key: string]: string; // Key: provider name (e.g., "BitDefender"), Value: category (e.g., "social networks")
}

// Enum for known methods of URL analysis.
export enum AnalysisMethod {
  Blacklist = "blacklist",
  Whitelist = "whitelist",
  Heuristic = "heuristic",
  Other = "other",
}

// Enum for known results of URL analysis.
export enum AnalysisResult {
  Clean = "clean",
  Malicious = "malicious",
  Unrated = "unrated",
  Phishing = "phishing",
  Suspicious = "suspicious",
}

// Represents the individual analysis result from each engine.
// Each engine gives its own category, engine name, analysis method, and result.
export interface AnalysisResultEntry {
  category: string; // Category assigned by the engine (e.g., "harmless", "malicious")
  engine_name: string; // The name of the analysis engine (e.g., "0xSI_f33d")
  method: AnalysisMethod; // The method used by the engine for analysis (e.g., "blacklist")
  result: AnalysisResult; // The result of the analysis (e.g., "clean", "unrated")
}

// Represents the analysis results from all the engines, keyed by the engine's name.
export interface LastAnalysisResults {
  [engineName: string]: AnalysisResultEntry; // Key: engine name (e.g., "ADMINUSLabs"), Value: analysis result
}

// Represents the statistics about the URL's safety from VirusTotal's last analysis.
// It counts the number of engines that classified the URL in different categories.
export interface LastAnalysisStats {
  harmless: number; // Number of engines that classified the URL as harmless
  malicious: number; // Number of engines that classified the URL as malicious
  suspicious: number; // Number of engines that classified the URL as suspicious
  timeout: number; // Number of engines that failed to classify the URL (timed out)
  undetected: number; // Number of engines that did not detect the URL or did not classify it
}

// Represents the data returned from an analysis, including a screenshot and various results.
export interface AnalysisData {
  url: string | null;
  screenshot?: string | null; // Screenshot may be missing in some analysis cases
  categories: Categories; // Categories assigned to the URL by various providers
  lastAnalysisStats: LastAnalysisStats; // Statistics from the last analysis
  lastAnalysisResults: LastAnalysisResults; // Results from the engines' analysis
}

export interface ErrorResponse {
  data?: {
    error?: string;
    message?: string;
  };
  error?: string;
}

export interface UserData {
  fullName: string | null; // full name can be null if user is not logged in
  email: string | null; // email can be null if user is not logged in
  image: string | null; // photoURL can be null if user doesn't have a photo
}

export interface GuestSession {
  userId: string; // The unique identifier for the authenticated user (e.g., "674869e22231f1738f72973b")
  expiresAt?: string; // The expiration date of the session in ISO string format
  role: unknown; // Fixed role for a guest user
  iat?: number; // Issued at (JWT standard - timestamp of when the token was issued)
  exp?: number; // Expiration time (JWT standard - timestamp of when the token expires)
  isAuth: boolean;
}

export interface Session {
  userId: string; // The unique identifier for the authenticated user (e.g., "674869e22231f1738f72973b")
  expiresAt?: string; // The expiration date of the session in ISO string format
  iat?: number; // Issued at (JWT standard - timestamp of when the token was issued)
  exp?: number; // Expiration time (JWT standard - timestamp of when the token expires)
}

export interface Subscription {
  currentPlan: CurrentPlan;
  status: string; // Example: 'active' | 'inactive'
}

export interface CurrentPlan {
  features: PlanFeature[];
  monthlyLookups: number;
  price: number;
  title: string;
  _id: string; // MongoDB ObjectId as a string
}

export interface PlanFeature {
  name: string;
  value: number | boolean; // Some features have numeric values; others are boolean
  _id: string; // MongoDB ObjectId as a string
}

export interface UsageStats {
  lastResetDate: Date; // Date type to handle timestamp
  monthlyLookupsUsed: number; // Tracks usage for the current month
}

export interface AuthenticatedUserData {
  _id: string; // MongoDB user ID
  email: string; // User's email
  fullName: string; // User's full name
  image: string; // User's profile image
  role: "user" | "admin"; // User's role
  subscription: Subscription; // User's subscription details
  usageStats: UsageStats; // User's usage statistics
}

export interface Plan {
  id: number;
  offer: string;
  price: number;
  title: string;
  desc: string;
  features: string[];
}
