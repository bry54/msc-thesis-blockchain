import React from 'react';
import { View, Button, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const MainScreen = () => {
    const {username, token, error} = useSelector((state) => state.auth);
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="View History" onPress={() => navigation.navigate('History')} />
            {username ? (
                <>
                    <Button title="Update Details" onPress={() => navigation.navigate('UpdateDetails')} />
                    <Text>Logged in as: {username}</Text>
                </>
            ) : (
                <Button title="Login" onPress={() => navigation.navigate('Login')} />
            )}
        </View>
    );
};

export default MainScreen;
