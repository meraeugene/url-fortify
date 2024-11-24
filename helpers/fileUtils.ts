export const isValidImageFile = (file: File): boolean => {
  // Check MIME type to ensure the file is JPG, PNG, or WEBP
  return (
    file.type.startsWith("image/") &&
    (file.type.includes("jpeg") ||
      file.type.includes("png") ||
      file.type.includes("webp"))
  );
};
