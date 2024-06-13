import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import StackNavigator from './src/navigation/stack-navigator';
import StoreProvider from './src/store';

const App = () => {
    return (
        <StoreProvider>
            <SafeAreaProvider>
                <StackNavigator />
            </SafeAreaProvider>
        </StoreProvider>
    );
};

export default App;
