import { TokenType } from '@/context/tokenData';

interface RawToken {
  id?: string;
  twitterUserId?: string;
  userId?: string;
  ticker?: string;
  name?: string;
  description?: string;
  verificationStatus?: string;
  avatarImg?: string;
  featuredStatus?: string;
  status?: string;
  statusMsg?: string | null;
  mintAddress?: string;
  dateMinted?: string | null;
  media?: {
    type?: string;
    mediaURL?: string;
    position?: number;
  }[];
  tokenomics?: {
    version?: number;
    tokenSupply?: number;
    decimals?: number;
    tokenType?: string;
    lp?: Record<string, unknown>;
    creatorIntermediateWallet?: {
      walletName?: string;
      walletId?: string;
      address?: string;
    };
    scoutIntermediateWallet?: {
      walletName?: string;
      walletId?: string;
      address?: string;
    };
  };
  launchedBy?: {
    userId?: string;
    name?: string;
    avatarURL?: string;
    instagramURL?: string;
    twitterURL?: string;
  };
  marketSummary?: {
    marketCap?: number;
    volume?: number;
    holder?: number;
    liquidity?: number;
    price?: number;
  };
  tokenPrice?: number;
  tweetInput?: {
    mentionId?: string;
    tweetId?: string;
    twitterConversationId?: string;
    tweetCreatorUserId?: string;
    tweetReplyAuthorId?: string;
  };
  dateCreated?: string;
  dateUpdated?: string;
  tokenomicsFeatures?: null;
  flags?: null;
  tokenCategory?: string | null;
  mentionId?: string | null;
  blockCreatorFees?: boolean;
  version?: number;
}

interface RawData {
  data?: {
    tokenOfTheDay?: RawToken;
    featured?: RawToken[];
    newTokens?: RawToken[];
  };
}

function mapToTokenType(token: RawToken): TokenType {
  return {
    ticker: token.ticker || '',
    name: token.name || '',
    description: token.description || '',
    img: {
      logo: token.avatarImg || '',
      banner: ''
    },
    price: typeof token.tokenPrice === 'number' ? token.tokenPrice : 0,
    dexId: '',
    priceChange: {
      fiveH: 0,
      twentyFourH: 0
    },
    txn: {
      buys: 0,
      sells: 0
    },
    tokenomics: {
      marketCap: token.marketSummary?.marketCap || 0,
      volume: {
        fiveH: 0,
        twentyFourH: 0
      },
      holder: token.marketSummary?.holder || 0,
      liquidity: token.marketSummary?.liquidity || 0,
      price: token.marketSummary?.price || 0
    },
    media: token.media 
      ? token.media.map(m => ({
          type: m.type || '',
          mediaUrl: m.mediaURL || '',
          position: m.position || 0
        }))
      : [],
    mintadd: token.mintAddress || ''
  };
}

export function transformRawData(rawData: RawData): TokenType[] {
  const data = rawData.data || {};
  const tokens: TokenType[] = [];

  if (data.tokenOfTheDay) {
    tokens.push(mapToTokenType(data.tokenOfTheDay));
  }

  if (Array.isArray(data.featured)) {
    data.featured.forEach(token => tokens.push(mapToTokenType(token)));
  }

  if (Array.isArray(data.newTokens)) {
    data.newTokens.forEach(token => tokens.push(mapToTokenType(token)));
  }

  return tokens;
}