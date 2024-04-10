import converter from "bech32-converting";

// Convert input to Bech32 format
export const toBech32 = (input: string): string => {
  return converter("evmos").toBech32(input);
};

// Convert input to HEX format
export const toHex = (input: string): string => {
  return converter("evmos").toHex(input);
};
