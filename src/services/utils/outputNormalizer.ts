
/**
 * Normalizes output strings to make comparison more reliable.
 * This handles common formatting differences like whitespace and quotes.
 */
export const normalizeOutput = (output: string): string => {
  if (!output) return "";
  
  // Handle special cases for common data structures
  const trimmed = output.trim();
  
  // Handle array output normalization
  if ((trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      // Try to parse as JSON and re-stringify to ensure consistent format
      const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
      return JSON.stringify(parsed);
    } catch {
      // If parsing fails, do basic normalization
      return trimmed
        .replace(/\s+/g, '')  // Remove all whitespace
        .replace(/'/g, '"')   // Replace single quotes with double quotes
        .replace(/,\]/g, ']'); // Remove trailing commas
    }
  }
  
  // Handle dictionary/object output
  if ((trimmed.startsWith('{') && trimmed.endsWith('}'))) {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
      return JSON.stringify(parsed);
    } catch {
      // If parsing fails, do basic normalization
      return trimmed
        .replace(/\s+/g, '')  // Remove all whitespace
        .replace(/'/g, '"')   // Replace single quotes with double quotes
        .replace(/,}/g, '}'); // Remove trailing commas
    }
  }

  // For number outputs, ensure consistent formatting
  if (!isNaN(Number(trimmed))) {
    return Number(trimmed).toString();
  }
  
  // For boolean outputs
  if (trimmed.toLowerCase() === 'true' || trimmed.toLowerCase() === 'false') {
    return trimmed.toLowerCase();
  }
  
  // For other outputs, normalize whitespace and trim
  return trimmed.replace(/\s+/g, ' ');
};
