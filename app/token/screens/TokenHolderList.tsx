import { Text } from '@/components/ui/CustomText';
import { align, bdr, flex, fx, h, justify, p, text, w } from 'nativeflowcss';
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Image, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { TokenType } from '@/context/tokenData';
import { formatCryptoNumber } from '@/utils/formatNumbers';
import { Copy, Check } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';

interface TokenHolder {
    balance: string;
    balanceFormatted: string;
    isContract: boolean;
    ownerAddress: string;
    usdValue: string;
    percentageRelativeToTotalSupply: number;
}

interface TokenHolderResponse {
    cursor: string;
    page: number;
    pageSize: number;
    totalSupply: string;
    result: TokenHolder[];
}

interface TokenMetadataProps {
    token: TokenType;
}

export const TokenHolderList = ({ token }: TokenMetadataProps) => {
    const insets = useSafeAreaInsets();
    const [holders, setHolders] = useState<TokenHolder[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalSupply, setTotalSupply] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [copiedAddresses, setCopiedAddresses] = useState<Set<string>>(new Set());
    const fadeAnimRefs = useRef<Map<string, Animated.Value>>(new Map());

    useEffect(() => {
        fetchTokenHolders();
    }, []);

        const fetchTokenHolders = async (retryCount = 0) => {
        const maxRetries = 3;
        
        try {
            setLoading(true);
            const response = await axios.get<TokenHolderResponse>(
                `https://solana-gateway.moralis.io/token/mainnet/${token.mintadd}/top-holders?limit=30`,
                {
                    headers: {
                        accept: 'application/json',
                        'X-API-Key': process.env.EXPO_PUBLIC_MORALIS_API_KEY
                    }
                }
            );
    
            setHolders(response.data.result);
            setTotalSupply(parseFloat(response.data.totalSupply));
            setError(null);
        } catch (err: any) {
            // Check if it's a 500 error and we haven't exceeded max retries
            if (err.response?.status === 500 && retryCount < maxRetries) {
                console.log(`500 error encountered, retrying... (${retryCount + 1}/${maxRetries})`);
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
                return fetchTokenHolders(retryCount + 1);
            }
            
            setError('Failed to fetch token holders');
            console.error('Error fetching token holders:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 4)}.....${address.slice(-4)}`;
    };

    const getHolderStats = () => {
        const top10Percentage = holders.slice(0, 10).reduce((sum, holder) => sum + holder.percentageRelativeToTotalSupply, 0);
        const holdersAbove1Percent = holders.filter(holder => holder.percentageRelativeToTotalSupply > 1).length;

        return {
            totalHolders: token.tokenomics?.holder || 0,
            top10Percentage: top10Percentage.toFixed(2),
            holdersAbove1Percent
        };
    };

    const renderStatsBoxes = () => {
        const stats = getHolderStats();

        return (
            <View style={[flex.row, align.items_center, justify.between, p.px_3, flex.gap_4, p.pb_6]}>
                {/* Total Holders */}
                <View style={[p.p_2, bdr.rounded_lg, bdr.w_1, bdr.color_zinc_500, flex.gap_1, fx.bg_transparent, align.items_center]}>
                    <Text style={[text.fs_xs, text.color_zinc_400, text.align_center]} weight="medium">
                        TOTAL HOLDERS
                    </Text>
                    <Text style={[text.fs_lg, text.color_zinc_100, text.align_center]} weight="bold">
                        {stats.totalHolders.toLocaleString()}
                    </Text>
                </View>

                {/* Top 10 Holders % */}
                <View style={[flex.f_1, p.p_2, bdr.rounded_lg, bdr.w_1, bdr.color_zinc_500, flex.gap_1, fx.bg_transparent, align.items_center]}>
                    <Text style={[text.fs_xs, text.color_zinc_400, text.align_center]} weight="medium">
                        TOP 10 HOLD
                    </Text>
                    <Text style={[text.fs_lg, Number(stats.top10Percentage) > 25 ? text.color_red_600 : text.color_green_600, text.align_center]} weight="bold">
                        {stats.top10Percentage}%
                    </Text>
                </View>

                {/* Holders > 1% */}
                <View style={[flex.f_1, p.p_2, bdr.rounded_lg, bdr.w_1, bdr.color_zinc_500, flex.gap_1, fx.bg_transparent, align.items_center]}>
                    <Text style={[text.fs_xs, text.color_zinc_400, text.align_center]} weight="medium">
                        WHALES ({'>'}1%)
                    </Text>
                    <Text style={[text.fs_lg, text.color_zinc_100, text.align_center]} weight="bold">
                        {stats.holdersAbove1Percent}
                    </Text>
                </View>
            </View>
        );
    };

    const renderHolderItem = ({ item, index }: { item: TokenHolder; index: number }) => {
    if (!fadeAnimRefs.current.has(item.ownerAddress)) {
        fadeAnimRefs.current.set(item.ownerAddress, new Animated.Value(0));
    }
    const fadeAnim = fadeAnimRefs.current.get(item.ownerAddress)!;

    const handleCopy = async () => {
        await Clipboard.setStringAsync(item.ownerAddress);
        setCopiedAddresses(prev => new Set([...prev, item.ownerAddress]));

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();

        setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                setCopiedAddresses(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(item.ownerAddress);
                    return newSet;
                });
            });
        }, 1500);
    };

    const handleViewPortfolio = () => {
        router.push(`/portfolio/${item.ownerAddress}` as any);
    };

    const isCopied = copiedAddresses.has(item.ownerAddress);

    return (
        <View style={[p.p_3, bdr.color_zinc_500, bdr.b_w_(0.5)]}>
            <View style={[flex.row, justify.between, align.items_center]}>
                <View style={[flex.f_1]}>
                    <View style={[flex.row, align.items_center, flex.gap_2]}>
                        <Text style={[text.fs_sm, text.color_zinc_300]} weight="medium">
                            {formatAddress(item.ownerAddress)}
                        </Text>
                        <Pressable
                            onPress={handleCopy}
                            style={[p.p_1, bdr.rounded_sm]}
                        >
                            {isCopied ? (
                                <Animated.View style={[flex.row, align.items_center, { opacity: fadeAnim }]}>
                                    <Check size={12} color="#9CA3AF" />
                                </Animated.View>
                            ) : (
                                <Copy size={12} color="#71717a" />
                            )}
                        </Pressable>
                    </View>
                    <Text style={[text.fs_xs, text.color_zinc_500]}>
                        {item.percentageRelativeToTotalSupply.toFixed(2)}%
                    </Text>
                </View>
                <View style={[align.items_center, justify.center, flex.gap_2, flex.row]}>
                    <View style={[align.items_end, flex.gap_1]}>
                        <Text style={[text.fs_sm, text.color_zinc_300]} weight="medium">
                            {formatCryptoNumber(Number(item.balanceFormatted))}
                        </Text>
                        <View style={[fx.bg_color_zinc_100, w.w_14, h.h_2, bdr.rounded_full]}>
                            <View style={[fx.bg_color_zinc_600, w.w_(`${((Number(item.balanceFormatted) / totalSupply) * 600)}`), h.h_2, bdr.rounded_full]}></View>
                        </View>
                    </View>
                    <Pressable
                        onPress={handleViewPortfolio}
                        style={[
                            p.px_3,
                            p.py_2,
                            bdr.rounded_md,
                            { backgroundColor: '#1e293b' },
                            bdr.w_1,
                            { borderColor: '#3b82f6' }
                        ]}
                    >
                        <Text style={[text.fs_xs, { color: '#3b82f6' }]} weight="medium">
                            Portfolio
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

    const renderHeader = () => (
        <View style={[p.px_3, p.pb_4]}>
            <Text style={[text.fs_lg, text.color_white, p.mb_4]} weight="bold">
                Top Token Holders
            </Text>
        </View>
    );

    const renderFooter = () => (
        <View style={[p.px_3, p.pb_4]}>
            <Text style={[text.fs_xs, text.color_zinc_500, text.align_center]} weight="medium">
                * Trade with caution. Cryptocurrency investments carry high risk.
            </Text>
            {/* Safe Area Bottom Spacing */}
            <View style={{ height: insets.bottom + 80 }} />
        </View>
    );

    if (loading) {
        return (
            <View style={[flex.f_1, justify.center, align.items_center]}>
                <Image
                    source={require('@/assets/images/catto-full.png')}
                    style={[h.h_48, w.w_48, { marginBottom: 20 }]}
                    resizeMode='contain'
                />
                <Text style={[text.color_zinc_500, { marginTop: -40 }]} weight="medium">
                    Lazy catto is fetching token holders...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[flex.f_1, flex.justify_center, flex.items_center, p.pt_(110)]}>
                <Text style={[text.fs_sm, text.color_red_500]} weight="medium">
                    {error}
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            style={[flex.f_1, p.pt_(80)]}
            data={holders}
            renderItem={renderHolderItem}
            keyExtractor={(item) => item.ownerAddress}
            ListHeaderComponent={() => (
                <>
                    {renderHeader()}
                    {renderStatsBoxes()}
                </>
            )}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[p.px_3]}
        />
    );
};