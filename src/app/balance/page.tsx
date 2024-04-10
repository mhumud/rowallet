'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBalance } from '../../lib/api';
import { AccountInput } from '../../components/AccountInput';
import { useNavBarAccount } from '@/components/NavBarContext';
import { toBech32, toHex } from '@/lib/bech32';
import { getPrice } from '@/lib/coin-gecko';
import { renderAccount } from '@/lib/utils';

const BalancePage = () => {
  const { account: walletAccount } = useNavBarAccount();
  const [manualAccount, setManualAccount] = useState('');
  const [account, setAccount] = useState('');
  const [accountBech32, setAccountBech32] = useState('');
  const [balance, setBalance] = useState(0);
  const [coinPrice, setCoinPrice] = useState(0);
  
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
      setBalance(balance);
    };
    
    
    fetchWalletBalance();
  }, [account]);
  
  useEffect(() => {
    // Get coin price from Coin Gecko
    const getCoinGeckoPrice = async () => {
      const price = await getPrice({
        sourceCoin: 'evmos',
        targetCoin: 'eur',
    })
      setCoinPrice(price);
    }

    getCoinGeckoPrice();
  }, []);

  const handleManualAccountChange = (account: string) => {
    setManualAccount(account);
  };

  return (
    <div>
      <AccountInput onManualAccountChange={handleManualAccountChange} />
      {renderAccount(account, accountBech32) && (
        <div>
          <p>HEX: {account}</p>
          <p>Evmos: {accountBech32}</p>
          <p>Balance: {balance} TEVMOS</p>
          <p>Evmos Price: {coinPrice} USD</p>
          <p>USD Balance: {balance * coinPrice} USD</p>
        </div>
      )}
      <Link href="/"> Go back </Link>
    </div>
  );
};

export default BalancePage;