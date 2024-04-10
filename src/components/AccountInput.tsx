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
      <input type="text" onChange={handleInputChange} placeholder="Enter wallet account address manually in hex" />
    </div>
  );
};
