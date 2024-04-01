"use client"

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useNavBarAccount } from '@/components/NavBarContext';
import { ethers } from 'ethers';
import axios from 'axios';

const BalancePage = () => {
  const { account } = useNavBarAccount();
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
              account,
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
        const weiBalance = parseInt(hexBalance, 16).toString();
        const balance = ethers.formatEther(weiBalance);

        // Set balance value
        setBalance(balance);
      } catch (error) {
        console.error('Error occurred:', error);
      }
    };

    if (account) {
      fetchData();
    }
  }, [account]);

  return (
    <div>
      <h1>Balance Page</h1>
      <p>This is the balance page content.</p>
      {account && 
        <div>
          <p>{account}</p>
          <p>{balance} TEVMOS</p>
        </div>
      }
      <Link href="/">
        Go back
      </Link>
    </div>
  );
};

const GetBalance = async (account: string) => {
  try {
    const response = await axios.post(
      'https://t-evmos-jsonrpc.kalia.network',
      {
        'jsonrpc': '2.0',
        'method': 'eth_getBalance',
        'params': [
          {account},
          'latest'
        ],
        'id': 1
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const hexBalance = response.data.result
    const weiBalance = parseInt(hexBalance, 16).toString();
    const balance = ethers.formatEther(weiBalance);
  
    return balance
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

export default BalancePage;