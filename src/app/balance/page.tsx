"use client"

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useNavBarAccount } from '@/components/NavBarContext';
import { ethers } from 'ethers';
import axios from 'axios';
import { formatBalance } from '@/lib/utils';

const BalancePage = () => {
  const { account: walletAccount } = useNavBarAccount();
  const [manualAccount, setManualAccount] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://t-evmos-jsonrpc.kalia.network', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'jsonrpc': '2.0',
            'method': 'eth_getBalance',
            'params': [
              manualAccount ? manualAccount : walletAccount,
              'latest'
            ],
            'id': 1
          })
        });

        if (!response.ok) {
          // Handle error if response is not OK
          throw new Error('Failed to fetch data');
        }

        // Parse JSON response
        const { result: hexBalance } = await response.json();
        
        // Transform result
        const weiBalance = parseInt(hexBalance, 16) || 0;
        const balance = weiBalance * (10 ** -18);

        // Set balance value
        setBalance(balance.toString());
      } catch (error) {
        setBalance('Invalid addreess')
        console.error('Error occurred:', error);
      }
    };

    if (walletAccount) {
      fetchData();
    }
  }, [walletAccount, manualAccount]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setManualAccount(event.target.value);
  };

  return (
    <div>
      <div>
        <input type="text" value={manualAccount} onChange={handleInputChange} placeholder="Enter wallet account address manually in hex" />
      </div>
      <h1>Balance Page</h1>
      <p>This is the balance page content.</p>
      {manualAccount ?
        <div>
          <p>{manualAccount}</p>
          <p>{balance} TEVMOS</p>
        </div> :
        walletAccount ?
        <div>
          <p>{walletAccount}</p>
          <p>{balance} TEVMOS</p>
        </div> :
        <div>
          <p>Log in with your wallet or enter a valid wallet account</p>
        </div>
      }
      <Link href="/">
        Go back
      </Link>
    </div>
  );
};

export default BalancePage;