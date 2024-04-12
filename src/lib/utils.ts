import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format address for clarity
export const formatAddress = (addr: string | undefined) => {
  return `${addr?.substring(0, 8)}...`;
};

// Define a boolean that indicated whether the account information is showed
export const renderAccount = (account: string, accountBech32: string) : boolean => {
  if (account && accountBech32 && account !== accountBech32) {
    const accountLowerCase = account.toLowerCase();
    const accountBech32LowerCase = accountBech32.toLocaleLowerCase();

    if (accountLowerCase.startsWith('0x') && accountBech32LowerCase.startsWith('evmos')) {
      return true;
    }
  }

  return false
}
