// utils.ts
export const RISKY_KEYWORDS = [
  "phishing",
  "fraud",
  "scam",
  "illegal",
  "unethical",
  "suspicious",
];

export const containsRiskyKeyword = (value: string | number): boolean => {
  if (typeof value === "string") {
    const normalizedValue = value.toLowerCase();
    return RISKY_KEYWORDS.some((keyword) => normalizedValue.includes(keyword));
  }
  return false;
};

// ANALYSIS CARD UTILITIES
export const getDescription = (title: string): string | null => {
  const descriptions: Record<string, string> = {
    timeout: "Engines that failed to classify the URL due to a timeout.",
    suspicious: "Engines flagged the URL as potentially suspicious.",
    malicious: "Engines identified the URL as malicious or harmful.",
    harmless: "Engines confirmed the URL is safe and harmless.",
    undetected: "Engines did not detect or classify the URL.",
  };

  return descriptions[title.toLowerCase()] || "Analysis data of the URL";
};

export const getStyleByTitle = (title: string) => {
  const styles: Record<string, { boxShadow: string; textColor: string }> = {
    timeout: {
      boxShadow: "shadow-sm shadow-blue-400",
      textColor: "text-blue-400",
    },
    suspicious: {
      boxShadow: "shadow-sm shadow-yellow-500",
      textColor: "text-yellow-500",
    },
    malicious: {
      boxShadow: "shadow-sm shadow-red-500",
      textColor: "text-red-500",
    },
    harmless: {
      boxShadow: "shadow-sm shadow-green-500",
      textColor: "text-green-500",
    },
    undetected: {
      boxShadow: "shadow-sm shadow-gray-400",
      textColor: "text-gray-400",
    },
  };

  return (
    styles[title.toLowerCase()] || {
      boxShadow: "shadow-sm shadow-gray-600",
      textColor: "text-gray-400",
    }
  );
};

// CATEGORIES CARD UTILITIES
export const getCardClasses = (hasRiskyValue: boolean) => {
  return {
    shadowClasses: hasRiskyValue
      ? "shadow-sm shadow-red-500 "
      : "shadow-sm shadow-gray-600",
    textClasses: hasRiskyValue ? "text-red-500" : "text-green-500",
  };
};

// OVERALL ANALYSIS
export const getUrlAnalysisStatus = (isSafe: boolean) => {
  const title = isSafe ? "Fortified URL" : "Vulnerable URL";
  const description = isSafe
    ? "Congratulations! The URL has passed all security checks..."
    : "Warning: The URL has been flagged for potential security risks...";

  const titleClass = isSafe ? "text-green-500" : "text-red-500";
  const boxClass = isSafe
    ? "shadow-sm shadow-green-500 border-green-500 "
    : "shadow-sm shadow-red-500 border-red-500 ";

  return { title, description, titleClass, boxClass };
};
