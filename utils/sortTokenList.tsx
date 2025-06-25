import { TokenType } from '@/context/tokenData';

type SortParameter = 'PRICE' | 'VOL' | 'MCAP' | 'LIQ' | 'TXNS' | 'HOLDER';

export const sortTokenList = (tokens: TokenType[], sortBy: SortParameter): TokenType[] => {
  const sortedTokens = [...tokens];

  switch (sortBy) {
    case 'PRICE':
      return sortedTokens.sort((a, b) => b.price - a.price);
    
    case 'VOL':
      return sortedTokens.sort((a, b) => 
        (b.tokenomics.volume.twentyFourH) - (a.tokenomics.volume.twentyFourH)
      );
    
    case 'MCAP':
      return sortedTokens.sort((a, b) => 
        b.tokenomics.marketCap - a.tokenomics.marketCap
      );
    
    case 'LIQ':
      return sortedTokens.sort((a, b) => 
        b.tokenomics.liquidity - a.tokenomics.liquidity
      );
    
    case 'TXNS':
      return sortedTokens.sort((a, b) => 
        ((b.txn.buys + b.txn.sells) - (a.txn.buys + a.txn.sells))
      );
    
    case 'HOLDER':
      return sortedTokens.sort((a, b) => 
        b.tokenomics.holder - a.tokenomics.holder
      );
    
    default:
      return sortedTokens;
  }
};