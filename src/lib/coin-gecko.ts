import { CoinGeckoClient } from 'coingecko-api-v3';

// Interface to be updated when new options are added
interface GetPriceProps {
  sourceCoin: 'evmos'
  targetCoin: 'usd' | 'eur'
}

const client = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});

// Get prices from CoinGecko
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

    // Get price value
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
