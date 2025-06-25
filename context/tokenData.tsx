import React, { createContext, useState } from "react";

interface MarketMetrics {
  lifetimeVolume: string;
  coinLaunches: string;
  activeCoins: string;
  totalMarketCap: {
    total: string;
    creatorCoins: string;
    launchCoin: string;
  };
  volume24h: {
    total: string;
    creatorCoins: string;
    launchCoin: string;
  };
  transactions24h: {
    total: string;
    creatorCoins: string;
    launchCoin: string;
  };
  totalLiquidity: {
    total: string;
    creatorCoins: string;
    launchCoin: string;
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
    lifetimeVolume: '0',
    coinLaunches: '0',
    activeCoins: '0',
    totalMarketCap: { total: '0', creatorCoins: '0', launchCoin: '0' },
    volume24h: { total: '0', creatorCoins: '0', launchCoin: '0' },
    transactions24h: { total: '0', creatorCoins: '0', launchCoin: '0' },
    totalLiquidity: { total: '0', creatorCoins: '0', launchCoin: '0' },
  },
  setTokenList: () => {},
  setMarketMetrics: () => {},
});

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokenList, setTokenList] = useState<TokenType[]>([
      // mintAddress: "ABC123xyz...",
      // fiveH: '2.5',
      // twentyFourH: '-1.2',
      // volume: '1500000',
      // liquidity: '2500000',
      // price: '1.23',
      // token: "SOL",
      // name: "Solana",
      // description: "Solana is a high-performance blockchain platform"
    ]);

  const [marketMetrics, setMarketMetrics] = useState<MarketMetrics>({
    lifetimeVolume: '3,771,943,938',
    coinLaunches: '40,612',
    activeCoins: '157',
    totalMarketCap: {
      total: '231.30M',
      creatorCoins: '116.74M',
      launchCoin: '114.56M'
    },
    volume24h: {
      total: '58.86M',
      creatorCoins: '22.78M',
      launchCoin: '36.08M'
    },
    transactions24h: {
      total: '118.03K',
      creatorCoins: '49.10K',
      launchCoin: '68.93K'
    },
    totalLiquidity: {
      total: '24.46M',
      creatorCoins: '18.90M',
      launchCoin: '5.56M'
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