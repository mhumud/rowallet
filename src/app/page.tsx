"use client"

import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
      <Link href="/balance">
        Balance Page
      </Link>
    </div>
  );
};

export default HomePage;
