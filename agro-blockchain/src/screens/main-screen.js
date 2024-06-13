import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {Button, Text, Skeleton} from '@rneui/themed';

const MainScreen = () => {
    const {isLoggedIn, user } = useSelector((state) => state.auth);
    const qrScanState = useSelector((state) => state.qrScan);
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ marginVertical: 20 }}>
                {
                    qrScanState.isLoading ? (
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Skeleton width={120} height={40} />
                            <Skeleton circle width={40} height={40} />
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Text>{ JSON.stringify(qrScanState.product) }</Text>
                        </View>
                    )
                }
            </View>

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
