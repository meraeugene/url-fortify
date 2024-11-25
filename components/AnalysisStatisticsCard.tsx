const getDescription = (title: string): string | null => {
  const descriptions: Record<string, string> = {
    timeout: "Engines that failed to classify the URL due to a timeout.",
    suspicious: "Engines flagged the URL as potentially suspicious.",
    malicious: "Engines identified the URL as malicious or harmful.",
    harmless: "Engines confirmed the URL is safe and harmless.",
    undetected: "Engines did not detect or classify the URL.",
  };

  return descriptions[title.toLowerCase()] || "Analysis data of the URL";
};

const getStyleByTitle = (title: string) => {
  const styles: Record<string, { boxShadow: string; textColor: string }> = {
    timeout: {
      boxShadow: "shadow-sm shadow-blue-500",
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
    malware: {
      boxShadow: "shadow-sm shadow-red-500",
      textColor: "text-red-500",
    },
    harmless: {
      boxShadow: "shadow-sm shadow-green-500",
      textColor: "text-green-500",
    },
    undetected: {
      boxShadow: "shadow-sm shadow-gray-500",
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

export const AnalysisStatisticsCard = ({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) => {
  const { boxShadow, textColor } = getStyleByTitle(title);

  return (
    <div
      className={`${boxShadow} border p-4`}
      style={{
        background: "rgb(4,7,29)",
        backgroundColor:
          "linear-gradient(90deg, rgba(3, 59, 43, 1) 0%, rgba(0, 237, 130, 1) 100%)",
        borderRadius: "calc(1.75rem * 0.96)",
      }}
    >
      <div className="analysis__container text-center">
        <h1 className={`text-base font-semibold tracking-wider ${textColor}`}>
          {title.toUpperCase()}
        </h1>
        <p className={`text-center text-3xl font-bold ${textColor}`}>{value}</p>
        <p className="text-sm mt-3 font-semibold text-gray-400">
          {getDescription(title)}
        </p>
      </div>
    </div>
  );
};
