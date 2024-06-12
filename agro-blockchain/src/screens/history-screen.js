import React from 'react';
import { View, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const HistoryScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1 }}>
            <WebView source={{ uri: 'https://google.com' }} style={{ flex: 1 }} />
        </View>
    );
};

export default HistoryScreen;
