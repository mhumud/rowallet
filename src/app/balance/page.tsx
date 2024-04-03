"use client"

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useNavBarAccount } from '@/components/NavBarContext';
import { CoinGeckoClient } from 'coingecko-api-v3';

const client = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});

const BalancePage = () => {
  const { account: walletAccount } = useNavBarAccount();
  const [manualAccount, setManualAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [evmosPrice, setEvmosPrice] = useState(0);
  
  useEffect(() => {
    const fetchEvmosPrice = async () => {
      const evmosPrice = await client.simplePrice({
        ids: 'evmos',
        vs_currencies: 'usd'
      })
      const { evmos: { usd } } = evmosPrice;

      setEvmosPrice(usd);
    }

    fetchEvmosPrice();
  }, [balance] )
  
  useEffect(() => {
    const fetchWalletData = async () => {
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
        const weiBalance = parseInt(hexBalance, 16);
        const balance = weiBalance * (10 ** -18);

        // Set balance value
        setBalance(balance);
      } catch (error) {
        setBalance(0)
        console.error('Error occurred:', error);
      }
    };

    if (walletAccount) {
      fetchWalletData();
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
      <p>1 EVMOS = {evmosPrice} USD</p>
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