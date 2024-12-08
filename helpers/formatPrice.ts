export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    // minimumFractionDigits: 0,
    // maximumFractionDigits: 0,
  }).format(amount / 100); // Assumes amount is in cents, so divide by 100
};
