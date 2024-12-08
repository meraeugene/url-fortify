export const formatPaymentMethod = (method: string | null | undefined) => {
  if (!method) return "Unknown Payment Method"; // Fallback for null or undefined
  return method
    .split("_") // Split the string by underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
    .join(" "); // Join the words back together with a space
};
