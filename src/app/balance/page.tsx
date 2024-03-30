import React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ethers } from 'ethers';

const BalancePage = async () => {
  const response = await axios.post(
    'https://t-evmos-jsonrpc.kalia.network',
    {
      'jsonrpc': '2.0',
      'method': 'eth_getBalance',
      'params': [
        '0x8e19C502FB1801670EBCE8b8b6778F4616B0420f',
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

  return (
    <div>
      <h1>Balance Page</h1>
      <p>This is the balance page content.</p>
      <p>{balance} TEVMOS</p>
      <Link href="/">
        Go back
      </Link>
    </div>
  );
};

export default BalancePage;