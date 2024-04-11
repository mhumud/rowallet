import React, { ChangeEvent, useEffect, useState } from 'react';
import { toBech32, toHex } from '../lib/bech32';

interface AccountInputProps {
  onManualAccountChange: (account: string) => void;
}

export const AccountInput: React.FC<AccountInputProps> = ({ onManualAccountChange }) => {

  // Handle input change event
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onManualAccountChange(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        onChange={handleInputChange}
        placeholder="Enter wallet account address manually in HEX or Evmos format"
        className="w-full bg-white text-gray-700 rounded-md px-4 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-opacity-50"
      />
    </div>
  );
};
