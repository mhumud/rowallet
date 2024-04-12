// Get the balance for a specific account
export const getBalance = async (account: string): Promise<number> => {
  try {
    const response = await fetch("https://t-evmos-jsonrpc.kalia.network", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [account, "latest"],
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    // Transform gotten response into readable numbers
    const { result: hexBalance } = await response.json();
    const weiBalance = parseInt(hexBalance, 16) || 0;
    const balance = weiBalance * 10 ** -18;
    return balance;
  } catch (error) {
    console.error("Error occurred:", error);
    return 0;
  }
};
