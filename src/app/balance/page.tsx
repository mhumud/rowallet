'use client'

import React, { useEffect, useState } from 'react';
import { getBalance } from '../../lib/api';
import { AccountInput } from '../../components/AccountInput';
import { useNavBarAccount } from '@/components/NavBarContext';
import { toBech32, toHex } from '@/lib/bech32';
import { getPrice } from '@/lib/coin-gecko';
import { renderAccount } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

const BalancePage = () => {
  // Get wallet account from the NavBar
  const { account: walletAccount } = useNavBarAccount();

  // Define the variables to be used in the Component State
  const [manualAccount, setManualAccount] = useState('');
  const [account, setAccount] = useState('');
  const [accountBech32, setAccountBech32] = useState('');
  const [balance, setBalance] = useState(0);
  const [balanceFiat, setBalanceFiat] = useState(0);
  const [coinPrice, setCoinPrice] = useState(0);
  
  // Define function that defines the account to be shown in the view
  const getAccount = (walletAccount: string | undefined, manualAccount: string) => {
    let account = '';
    let accountBech32 = '';

    manualAccount 
      ? account = manualAccount
      : account = walletAccount || '';
    
    const lowerCaseAccount = account.toLowerCase();
    
    try {
      if (lowerCaseAccount.startsWith('0x')) {
        accountBech32 = toBech32(account);
      } else if (lowerCaseAccount.startsWith('evmos')) {
        accountBech32 = account;
        account = toHex(accountBech32);
      } 
    } catch {
      console.log('Manual account not valid');
    }

    return {
      account,
      accountBech32,
    }
  }

  // Set account values when corresponds
  useEffect(() => {
    const {
      account,
      accountBech32,
    } = getAccount(walletAccount, manualAccount);

    setAccount(account);
    setAccountBech32(accountBech32);
  }, [walletAccount, manualAccount])


  useEffect(() => {
    // Fetch balance when wallet account changes
    const fetchWalletBalance = async () => {
      const balance = await getBalance(account);
      const formattedBalance = balance.toLocaleString('en-US', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
      setBalance(parseFloat(formattedBalance));
      
      // Set fiat balance when wallet account changes
      const balanceFiat = balance * coinPrice;
      const formattedBalanceFiat = balanceFiat.toLocaleString('en-US', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
      setBalanceFiat(parseFloat(formattedBalanceFiat));
    };
    
    
    fetchWalletBalance();
  }, [account, coinPrice]);
  
  // Get coin price from Coin Gecko
  useEffect(() => {
    const getCoinGeckoPrice = async () => {
      const price = await getPrice({
        sourceCoin: 'evmos',
        targetCoin: 'eur',
      });

      // Format price for better clarity
      const formattedPrice = price.toLocaleString('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      setCoinPrice(parseFloat(formattedPrice));
    }

    getCoinGeckoPrice();
  }, []);

  // Update manual account when account input changes
  const handleManualAccountChange = (account: string) => {
    setManualAccount(account);
  };
  
  return (
    <div className="flex flex-col gap-4 rounded-lg px-8 pt-4 pb-4">
      <AccountInput onManualAccountChange={handleManualAccountChange} />
      
      {/* Balance information (conditionally rendered) */}
      {renderAccount(account, accountBech32) && (
        <div className="grid grid-cols-1 gap-4">
          {/* Account information */}
          <div className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2 text-base">
            <div className='flex'>
              <p className="text-gray-700 font-bold">HEX:&nbsp;</p>
              <p className='overflow-hidden'>{account}</p>
            </div>
            <div className='flex'>
              <p className="text-gray-700 font-bold">Evmos:&nbsp;</p>
              <p className='overflow-hidden'>{accountBech32}</p>
            </div>
          </div>

          {/* Coin balance information */}
          <div className="bg-green-100 rounded-lg shadow-md p-4 grid grid-cols-2 gap-4 text-lg">
            <div className='flex'>
              <p className="text-gray-700 font-bold flex">Balance:</p>
            </div>
            <div className='flex'>
              <p className="text-green-500 font-bold flex">{balance} TEVMOS</p>
            </div>
          </div>
          
          {/* Fiat balance information */}
          <div className="bg-indigo-100 rounded-lg shadow-md p-4 grid grid-cols-2 gap-4 text-lg">
            <div className="flex">
              <p className="text-gray-700 font-bold">Balance in USD:</p>
            </div>
            <div className="flex">
              <p className="text-indigo-500 font-bold">{balanceFiat} USD</p>
            </div>
            <div className="flex">
              <p>Evmos Price:</p>
            </div>
            <div className="flex">
              <p>{coinPrice} USD</p>
            </div>
          </div>

            {/* Footer of the view */}
            <div className="flex text-gray-200 mx-2">
              <div className="flex-1">
                <p>2024 - Market price from&nbsp;
                  <a className='underline' target='blank' href='https://www.coingecko.com/en/api'>CoinGecko API</a>
                </p>
              </div>
              <div className="flex-1 text-end">
                <p>Version 1.0.1</p>
              </div>
            </div>
        </div>
      )}

      {/* Go back button */}
      <div className="flex justify-center mt-4">
        <Link href="/">
          <button className={buttonVariants()}>
            Go back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BalancePage;