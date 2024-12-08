export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds

  // Format the date as 'DD/MM/YYYY hh:mm A' (e.g., 06/12/2024 09:46 AM)
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Use 12-hour format (AM/PM)
  };

  return date.toLocaleString("en-GB", options); // 'en-GB' for UK-style date format
};
