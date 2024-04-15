This is a [Next.js](https://nextjs.org/) used to access the information in the [Test network of Evmos](https://chainlist.org/chain/9000).

## Getting Started

To run locally use:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## APP

# Homepage

You can see the homepage in which you can login into your wallet using MetaMask. Also, you can go into the balance page.

# Balance

In the balance page you can:
1. See the balance for the account that is logged in into the wallet
2. See the balance for any other account by using the text input. The account address can either be in HEX or Bech32

The fiat money price is being retrieved using CoinGecko API in order to show the balance in USD.

## Deployment

The site is deployed using Vercel.
