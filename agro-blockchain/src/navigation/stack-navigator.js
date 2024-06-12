import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import QRScannerScreen from '../screens/qr-scanner-screen';
import MainScreen from '../screens/main-screen';
import HistoryScreen from '../screens/history-screen';
import UpdateDetailsScreen from '../screens/update-details-screen';
import LoginScreen from "../screens/login-screen";

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="QRScanner">
                <Stack.Screen name="QRScanner" component={QRScannerScreen} />
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen name="History" component={HistoryScreen} />
                <Stack.Screen name="UpdateDetails" component={UpdateDetailsScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default StackNavigator;
