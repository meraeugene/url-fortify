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
