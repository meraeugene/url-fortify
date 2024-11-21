// INITIAL PRICE IS IN PH PESO RATE

// Adjust pricing based on countryCode directly
const USAConversionRate = 58.73;

export const formattedPrice = (countryCode: string | null, price: number) => {
  if (countryCode === "PH") {
    // Adjust for Philippines (multiply by conversion rate)
    return `₱${price}`;
  } else if (countryCode === "US") {
    // Adjust for USA (divide by conversion rate)
    return `$${(price / USAConversionRate).toFixed(2)}`; // Adding "$" for USD price
  }
};
