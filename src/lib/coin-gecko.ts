import { CoinGeckoClient } from 'coingecko-api-v3';
import { useEffect, useState } from 'react';

interface GetPriceProps {
  sourceCoin: 'evmos'
  targetCoin: 'usd' | 'eur'
}

const client = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});

export const getPrice = async (props: GetPriceProps): Promise<number> => {
  const{
    sourceCoin,
    targetCoin,
  } = props
  
  let price = 0;

  try {
    const priceData = await client.simplePrice({
      ids: sourceCoin,
      vs_currencies: targetCoin,
    });

    const { 
      [sourceCoin]: { 
        [targetCoin]: gottenPrice 
      } 
    } = priceData;
    price = gottenPrice;
  } catch (error) {
    console.log(`Error in request to CoinGecko: ${error}`);
  }

  return price;
};
