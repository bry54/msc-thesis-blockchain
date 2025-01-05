import React from 'react';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import {WEB_APP} from "../store/constants";

const HistoryScreen = ({ route }) => {
    const navigation = useNavigation();
    const { product } = route.params;

    const path = `${WEB_APP}/${product.id}`;

    return (
        <View style={{ flex: 1 }}>
            <WebView
                source={{ uri: `${path.toLowerCase().toString()}` }}
                style={{ flex: 1 }}
                incognito={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={false}
                onError={syntheticEvent => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                }}
                onHttpError={syntheticEvent => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView HTTP error: ', nativeEvent);
                }}
                onLoadProgress={({ nativeEvent }) => {
                    console.log('Loading progress: ', nativeEvent.progress, nativeEvent.url);
                }}
                onLoadEnd={() => {
                    console.log('Load finished');
                }}
                onLoadStart={() => {
                    console.log('Load started');
                }}
            />
        </View>
    );
};

export default HistoryScreen;
