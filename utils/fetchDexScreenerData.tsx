import axios from 'axios';
import { TokenType } from '@/context/tokenData';

const BATCH_SIZE = 30;
const BASE_URL = 'https://api.dexscreener.com/latest/dex/tokens';

const headers = {
  'Accept': '*/*',
  'Content-Type': 'application/json'
};

interface DexScreenerPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  priceNative: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    h6: number;
    h24: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  marketCap: number;
  fdv: number;
  info?: {
    imageUrl?: string;
    header?: string;
    websites?: Array<{
      label: string;
      url: string;
    }>;
    socials?: Array<{
      type: string;
      url: string;
    }>;
  };
}

export async function fetchDexScreenerBatches(tokens: TokenType[]) {
  try {
    const mintAddresses = tokens.map(token => token.mintadd).filter(Boolean);
    console.log(`Total tokens to process: ${mintAddresses.length}`); // Debug log
    
    const batches = [];
    for (let i = 0; i < mintAddresses.length; i += BATCH_SIZE) {
      const batch = mintAddresses.slice(i, i + BATCH_SIZE);
      batches.push(batch);
    }
    
    console.log(`Number of batches: ${batches.length}`); // Debug log
    
    const allDexData = [];
    for (const batch of batches) {
      try {
        const addressString = batch.join(',');
        console.log(`Batch size: ${batch.length}`); // Debug log
        console.log(`Processing addresses: ${addressString}`);
        
        const response = await axios.get<{ pairs: DexScreenerPair[] }>(
          `${BASE_URL}/${addressString}`,
          { headers }
        );
        
        if (response.data?.pairs) {
          allDexData.push(...response.data.pairs);
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (batchError) {
        console.warn(`Batch request failed:`, batchError);
        continue;
      }
    }

    console.log(`Total pairs fetched: ${allDexData.length}`);
    return updateTokensWithDexData(tokens, allDexData);
  } catch (error) {
    console.error('Error fetching DexScreener data:', error);
    return tokens;
  }
}

function updateTokensWithDexData(tokens: TokenType[], dexData: DexScreenerPair[]): TokenType[] {
  return tokens.map(token => {
    const dexPair = dexData.find(pair => 
      pair.baseToken.address.toLowerCase() === token.mintadd.toLowerCase()
    );

    if (!dexPair) return token;

    return {
      ...token,
      price: Number(dexPair.priceUsd) || 0,
      dexId: dexPair.dexId || '',
      img: {
        logo: dexPair.info?.imageUrl || '',
        banner: dexPair.info?.header || ''
      },
      priceChange: {
        fiveH: Number(dexPair.priceChange?.h6) || 0,
        twentyFourH: Number(dexPair.priceChange?.h24) || 0
      },
      txn: {
        buys: Number(dexPair.txns?.h24?.buys) || 0,
        sells: Number(dexPair.txns?.h24?.sells) || 0
      },
      tokenomics: {
        ...token.tokenomics,
        marketCap: Number(dexPair.marketCap) || 0,
        volume: {
          fiveH: Number(dexPair.volume?.h6) || 0,
          twentyFourH: Number(dexPair.volume?.h24) || 0
        },
        liquidity: Number(dexPair.liquidity?.usd) || 0,
        price: Number(dexPair.priceUsd) || 0,
        holder: token.tokenomics?.holder || 0
      }
    };
  });
}