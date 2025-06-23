import React, { createContext, useState } from "react";

interface Token {
  mintAddress: string;
  fiveH: string;     
  twentyFourH: string; 
  volume: string;
  liquidity: string;
  price: string;
  token: string;   
  name: string;
  description: string;
}

export const TokenContext = createContext<{
  tokenList: Token[];
  setTokenList: React.Dispatch<React.SetStateAction<Token[]>>;
}>({
  tokenList: [],
  setTokenList: () => {},
});

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokenList, setTokenList] = useState<Token[]>([ {
      mintAddress: "ABC123xyz...",
      fiveH: '2.5',
      twentyFourH: '-1.2',
      volume: '1500000',
      liquidity: '2500000',
      price: '1.23',
      token: "SOL",
      name: "Solana",
      description: "Solana is a high-performance blockchain platform"
    },]);

  return (
    <TokenContext.Provider
      value={{
        tokenList,
        setTokenList
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};