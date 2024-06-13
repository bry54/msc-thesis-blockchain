import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {Button, Text, Input} from '@rneui/themed';

const MainScreen = () => {
    const {isLoggedIn, user } = useSelector((state) => state.auth);
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button
                title="View Product History"
                onPress={() => navigation.navigate('History')}
                titleStyle={{ fontWeight: '700' }}
                buttonStyle={{
                    backgroundColor: 'rgba(92, 99,216, 1)',
                    borderColor: 'transparent',
                    borderWidth: 0,
                    borderRadius: 5,
                    paddingVertical: 10,
                }}
                containerStyle={{
                    width: 200,
                    marginHorizontal: 50,
                    marginVertical: 10,
                }}
            />
            {isLoggedIn ? (
                <>
                    <Button
                        title="Update Product Details"
                        onPress={() => navigation.navigate('UpdateDetails')}
                        titleStyle={{ fontWeight: '700' }}
                        buttonStyle={{
                            backgroundColor: 'rgba(92, 99,216, 1)',
                            borderColor: 'transparent',
                            borderWidth: 0,
                            borderRadius: 5,
                            paddingVertical: 10,
                        }}
                        containerStyle={{
                            width: 200,
                            marginHorizontal: 50,
                            marginVertical: 10,
                        }}
                    />
                    <Text>Logged in as: { user?.fullName }</Text>
                </>
            ) : (
                <Button
                    title="Login"
                    onPress={() => navigation.navigate('Login')}
                    titleStyle={{ fontWeight: '700' }}
                    buttonStyle={{
                        backgroundColor: 'rgba(92, 99,216, 1)',
                        borderColor: 'transparent',
                        borderWidth: 0,
                        borderRadius: 5,
                        paddingVertical: 10,
                    }}
                    containerStyle={{
                        width: 200,
                        marginHorizontal: 50,
                        marginVertical: 10,
                    }}
                />
            )}
        </View>
    );
};

export default MainScreen;
