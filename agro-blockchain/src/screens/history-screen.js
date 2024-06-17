import React from 'react';
import { View, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import {API_HOST, WEB_APP} from "../store/constants";

const HistoryScreen = ({ route }) => {
    const navigation = useNavigation();
    const { product } = route.params;

    const path = `${WEB_APP}/productions/${product.id}`;

    console.log(path)
    return (
        <View style={{ flex: 1 }}>
            <WebView source={{ uri: path }} style={{ flex: 1 }} />
        </View>
    );
};

export default HistoryScreen;
