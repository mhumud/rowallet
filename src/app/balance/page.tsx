"use client"

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import converter from 'bech32-converting';
import { useNavBarAccount } from '@/components/NavBarContext';
import { CoinGeckoClient } from 'coingecko-api-v3';

const client = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});

const BalancePage = () => {
  const { account: walletAccount } = useNavBarAccount();
  const [walletAccountBech32, setWalletAccountBech32] = useState('');
  const [manualAccountInput, setManualAccountInput] = useState('');
  const [manualAccount, setManualAccount] = useState('');
  const [manualAccountBech32, setManualAccountBech32] = useState('');
  const [balance, setBalance] = useState(0);
  const [evmosPrice, setEvmosPrice] = useState(0);

  useEffect(() => {
    try {
      const evmosPrefix = manualAccountInput.substring(0, 5);
      const hexPrefix = manualAccountInput.substring(0, 2);

      if (evmosPrefix.toLocaleLowerCase() == 'evmos') {
        setManualAccountBech32(manualAccountInput);
        
        const hex = converter('evmos').toHex(manualAccountInput);
        setManualAccount(hex);
      } else if (hexPrefix == '0x') {
        setManualAccount(manualAccountInput);
        
        const bech32 = converter('evmos').toBech32(manualAccountInput);
        setManualAccountBech32(bech32);
      } else {
        setManualAccount(manualAccountInput);
        setManualAccountBech32(manualAccountInput);
      }
    } catch {
      setManualAccount(manualAccountInput);
      console.log('Invalid HEX/Evmos account address');
    }
  }, [manualAccountInput])

  useEffect(() => {
    if (walletAccount) {
      const bech32 = converter('evmos').toBech32(walletAccount);
      setWalletAccountBech32(bech32)
    }
  }, [walletAccount])

  useEffect(() => {
    const fetchEvmosPrice = async () => {
      try {
        const evmosPrice = await client.simplePrice({
          ids: 'evmos',
          vs_currencies: 'usd'
        })
        const { evmos: { usd } } = evmosPrice;
  
        setEvmosPrice(usd);
      } catch (error) {
        console.log(`Error in request to CoinGecko ${error}`)
      }
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
        const weiBalance = parseInt(hexBalance, 16) || 0;
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
    setManualAccountInput(event.target.value);
  };

  return (
    <div>
      <div>
        <input type="text" value={manualAccountInput} onChange={handleInputChange} placeholder="Enter wallet account address manually in hex" />
      </div>
      <p>1 EVMOS = {evmosPrice} USD</p>
      <h1>Balance Page</h1>
      <p>This is the balance page content.</p>
      {manualAccount ?
        balance ? 
          <div>
            <p>HEX: {manualAccount}</p>
            <p>Bech32: {manualAccountBech32}</p>
          </div> :
          <div>
            <p>Enter a valid HEX/Evmos account</p>
          </div> :
      walletAccount ?
      <div>
        <p>HEX: {walletAccount}</p>
        <p>Bech32: {walletAccountBech32}</p>
      </div> :
      <div>
        <p>Log in with your wallet or enter a valid wallet account</p>
      </div>
      }
      {balance && <p>{balance} TEVMOS</p>}
      <Link href="/">
        Go back
      </Link>
    </div>
  );
};

export default BalancePage;