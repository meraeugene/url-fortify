import { v4 as uuidv4 } from "uuid";

export const generateUUIDInvoiceNumber = () => {
  const uuid = uuidv4().replace(/-/g, ""); // Remove dashes
  const numericPart = BigInt("0x" + uuid)
    .toString()
    .slice(0, 18); // Convert to number and truncate
  return numericPart;
};
