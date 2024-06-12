import React from 'react';
import { View, Button, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const MainScreen = () => {
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="View History" onPress={() => navigation.navigate('History')} />
            <Button title="Update Details" onPress={() => navigation.navigate('UpdateDetails')} disabled={!isLoggedIn} />
        </View>
    );
};

export default MainScreen;
