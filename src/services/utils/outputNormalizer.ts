
export const normalizeOutput = (output: string): string => {
  return String(output).trim().replace(/\s+/g, " ");
};
