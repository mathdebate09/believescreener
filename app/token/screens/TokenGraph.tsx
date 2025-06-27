import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { flex, fx, p, text } from 'nativeflowcss';

import { Colors } from '@/constants/Colors';
import { TokenType } from '@/context/tokenData';
import { Text } from '@/components/ui/CustomText';

interface TokenMetadataProps {
    token: TokenType;
}

const createChartHTML = (tokenAddress: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: ${Colors.black};
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        #price-chart-widget-container {
            width: 100%;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .loading {
            color: #68738D;
            text-align: center;
        }
        .error {
            color: #E64C4C;
            text-align: center;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div id="price-chart-widget-container">
        <div class="loading">Loading chart...</div>
    </div>
    
    <script>
        // Disable blob URL warnings
        const originalCreateObjectURL = URL.createObjectURL;
        URL.createObjectURL = function(obj) {
            try {
                return originalCreateObjectURL.call(this, obj);
            } catch (e) {
                console.warn('Blob URL creation blocked:', e);
                return '';
            }
        };
        
        // Load Moralis chart script
        const script = document.createElement('script');
        script.src = 'https://moralis.com/static/embed/chart.js';
        script.onload = function() {
            loadWidget();
        };
        script.onerror = function() {
            document.getElementById('price-chart-widget-container').innerHTML = 
                '<div class="error">Unable to load chart. Please check your connection.</div>';
        };
        document.head.appendChild(script);
        
        const PRICE_CHART_ID = 'price-chart-widget-container';
        
        const loadWidget = () => {
            try {
                if (typeof createMyWidget === 'function') {
                    createMyWidget(PRICE_CHART_ID, {
                        autoSize: true,
                        chainId: 'solana',
                        tokenAddress: '${tokenAddress}',
                        showHoldersChart: true,
                        defaultInterval: '1D',
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'Etc/UTC',
                        theme: 'moralis',
                        locale: 'en',
                        backgroundColor: '${Colors.black}',
                        gridColor: '#0d2035',
                        textColor: '#68738D',
                        candleUpColor: '#4CE666',
                        candleDownColor: '#E64C4C',
                        hideLeftToolbar: false,
                        hideTopToolbar: false,
                        hideBottomToolbar: false
                    });
                } else {
                    throw new Error('createMyWidget function is not defined.');
                }
            } catch (error) {
                console.error('Error loading widget:', error);
                document.getElementById('price-chart-widget-container').innerHTML = 
                    '<div class="error">Chart temporarily unavailable</div>';
            }
        };
    </script>
</body>
</html>
`;

export const TokenGraph = ({ token, style = [] }: TokenMetadataProps & { style?: any[] }) => {
    const insets = useSafeAreaInsets();
    const screenHeight = Dimensions.get('window').height;
    const [isLoading, setIsLoading] = useState(true);

    const headerHeight = 110;
    const bottomSpacing = insets.bottom + 110;
    const disclaimerHeight = 50;
    const availableHeight = screenHeight - headerHeight - bottomSpacing - disclaimerHeight;
    const chartHeight = Math.max(availableHeight * 1.1, 400);

    return (
        <View style={[flex.f_1, fx.bg_color_(Colors.black), ...style]}>
            <ScrollView
                style={[flex.f_1, p.pt_(110)]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[flex.f_1]}
            >
                {/* Price Chart */}
                <View style={[{ height: chartHeight }, fx.bg_color_(Colors.black)]}>
                    {isLoading && (
                        <View style={[flex.f_1, flex.row, flex.items_center, flex.justify_center]}>
                            <ActivityIndicator size="large" color="#68738D" />
                        </View>
                    )}
                    <WebView
                        source={{ html: createChartHTML(token.mintadd) }}
                        style={[flex.f_1, isLoading && { opacity: 0 }]}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        scalesPageToFit={true}
                        scrollEnabled={false}
                        allowsInlineMediaPlayback={true}
                        mediaPlaybackRequiresUserAction={false}
                        onLoadEnd={() => setIsLoading(false)}
                        onError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            console.error('WebView error: ', nativeEvent);
                            setIsLoading(false);
                        }}
                        onMessage={(event) => {
                            console.log('WebView message:', event.nativeEvent.data);
                        }}
                        originWhitelist={['*']}
                        mixedContentMode="compatibility"
                    />
                </View>

                <View style={[p.px_4, { marginTop: -35 }, fx.bg_color_(Colors.black)]}>
                    <Text style={[text.fs_xs, text.color_zinc_500, text.align_center]} weight="medium">
                        * Trade with caution. Cryptocurrency investments carry high risk.
                    </Text>
                </View>

                {/* Safe Area Bottom Spacing */}
                <View style={[{ height: insets.bottom + 110 }, fx.bg_color_(Colors.black)]} />
            </ScrollView>
        </View>
    );
};