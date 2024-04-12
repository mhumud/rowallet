import Link from "next/link";
import WalletIcon from "../../public/icons/WalletIcon";
import { Button, buttonVariants } from "./ui/button";
import { useSDK, MetaMaskProvider } from "@metamask/sdk-react";
import { formatAddress } from "../lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useNavBarAccount } from "./NavBarContext";
import { useEffect } from "react";
import evmosLogo from '../../public/evmos-logo.png';
import Image from 'next/image'
import './NavBar.css'

// Define logics for wallet button
const ConnectWalletButton = () => {
  const { sdk, connected, connecting, account } = useSDK();
  const { setAccount } = useNavBarAccount();

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.warn(`No accounts found`, err);
    }
  };

  const disconnect = () => {
    if (sdk) {
      sdk.terminate();
    }
  };

  // Update account when corresponds
  useEffect(() => {
    if (connected) {
      setAccount(account);
    } else {
      setAccount('');
    }
  }, [connected, account, setAccount]);

  return (
    // Show buttons depending on the state
    <div className="relative">
      {connected ? (
        <Popover>
          <PopoverTrigger>
            <p className={buttonVariants()}>{formatAddress(account)}</p>
          </PopoverTrigger>
          <PopoverContent className="mt-2 w-44 bg-gray-100 border rounded-md shadow-lg right-0 z-10 top-10">
            <button
              onClick={disconnect}
              className="block w-full pl-2 pr-4 py-2 text-left text-[#F05252] hover:bg-gray-200"
            >
              Disconnect
            </button>
          </PopoverContent>
        </Popover>
      ) : (
        <Button disabled={connecting} onClick={connect}>
          <WalletIcon className="mr-2 h-4 w-4" /> Connect Wallet
        </Button>
      )}
    </div>
  );
};

// Define NavBar component
const NavBar = () => {
    const host =
      typeof window !== "undefined" ? window.location.host : "defaultHost";
  
    const sdkOptions = {
      logging: { developerMode: false },
      checkInstallationImmediately: false,
      dappMetadata: {
        name: "Next-Metamask-Boilerplate",
        url: host,
      },
    };
  
    return (
      <nav className="flex items-center justify-between px-6 mx-auto py-7 rounded-xl">
        {/* Logo */}
        <Link href="/" className="flex gap-1 px-6">
          <span className="text-2xl font-bold sm:block">
            <Image 
              src={evmosLogo} 
              alt="Evmos logo"
              className="logo-image"
            />
          </span>
        </Link>

        {/* Wallet button */}
        <div className="flex gap-4 px-6">
          <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
            <ConnectWalletButton />
          </MetaMaskProvider>
        </div>
      </nav>
    );
  };
  
export default NavBar;