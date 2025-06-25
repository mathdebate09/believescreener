import React, { createContext, useState } from "react";

export interface MarketMetrics {
  lifetimeVolume: number;
  coinLaunches: number;
  activeCoins: number;
  totalMarketCap: {
    total: number;
    creatorCoins: number;
    launchCoin: number;
  };
  volume24h: {
    total: number;
    creatorCoins: number;
    launchCoin: number;
  };
  transactions24h: {
    total: number;
    creatorCoins: number;
    launchCoin: number;
  };
  totalLiquidity: {
    total: number;
    creatorCoins: number;
    launchCoin: number;
  };
}

export interface TokenType {
  ticker: string;
  name: string;
  description: string;
  img: {
    logo: string;
    banner: string;
  };
  price: number;
  dexId: string;
  priceChange: {
    fiveH: number;
    twentyFourH: number;
  };
  txn: {
    buys: number;
    sells: number;
  };
  tokenomics: {
    marketCap: number;
    volume: {
      fiveH: number;
      twentyFourH: number;
    };
    holder: number;
    liquidity: number;
    price: number;
  };
  media: {
    type: string;
    mediaUrl: string;
    position: number;
  }[];
  mintadd: string;
}

interface TokenContextType {
  tokenList: TokenType[];
  marketMetrics: MarketMetrics;
  setTokenList: React.Dispatch<React.SetStateAction<TokenType[]>>;
  setMarketMetrics: React.Dispatch<React.SetStateAction<MarketMetrics>>;
}

export const TokenContext = createContext<TokenContextType>({
  tokenList: [],
  marketMetrics: {
    lifetimeVolume: 0,
    coinLaunches: 0,
    activeCoins: 0,
    totalMarketCap: { total: 0, creatorCoins: 0, launchCoin: 0 },
    volume24h: { total: 0, creatorCoins: 0, launchCoin: 0 },
    transactions24h: { total: 0, creatorCoins: 0, launchCoin: 0 },
    totalLiquidity: { total: 0, creatorCoins: 0, launchCoin: 0 },
  },
  setTokenList: () => {},
  setMarketMetrics: () => {},
});

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokenList, setTokenList] = useState<TokenType[]>([]);

  const [marketMetrics, setMarketMetrics] = useState<MarketMetrics>({
    lifetimeVolume: 0,
    coinLaunches: 0,
    activeCoins: 0,
    totalMarketCap: {
      total: 0,
      creatorCoins: 0,
      launchCoin: 0
    },
    volume24h: {
      total: 0,
      creatorCoins: 0,
      launchCoin: 0
    },
    transactions24h: {
      total: 0,
      creatorCoins: 0,
      launchCoin: 0
    },
    totalLiquidity: {
      total: 0,
      creatorCoins: 0,
      launchCoin: 0
    }
  });

  return (
    <TokenContext.Provider
      value={{
        tokenList,
        marketMetrics,
        setTokenList,
        setMarketMetrics
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};