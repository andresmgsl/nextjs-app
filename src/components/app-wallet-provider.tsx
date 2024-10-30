"use client";
 
import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
 
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('@solana/wallet-adapter-react-ui/styles.css')
 
export default function AppWalletProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    //const network = WalletAdapterNetwork.Devnet;
    //const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    
    const endpoint = 'http://localhost:8899';

    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    );
  }