"use client"

import React from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-4 text-white">Check the balance of any EVMOS account</h1>
      <p className="text-center text-gray-200 text-lg">
        Go to the balance page to see your account balance or any other account&apos;s balance
      </p>
      <div className="flex justify-center mt-4">
        <Link href="/balance">
          <button className={buttonVariants()}>
            Balance Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
