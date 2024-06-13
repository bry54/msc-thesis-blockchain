// screens/LoginScreen.js
import React, { useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/actions';
import { useNavigation } from '@react-navigation/native';
import {Button, Text, Input} from '@rneui/themed';

const LoginScreen = () => {
    const [authCredentials, setAuthCredentials] = useState({username: '', password: ''});
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const navigation = useNavigation();

    const handleLogin = async () => {
        await dispatch(login(authCredentials));

        if (auth.isLoggedIn)
            navigation.navigate('Main');
    };

    const updateAuthCredentials = (prop, val) => {
        setAuthCredentials((prevState) =>{
            return {
                ...prevState,
                [prop]: val
            }
        })
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Input
                placeholder="Username"
                value={authCredentials.username}
                leftIcon={{ type: 'font-awesome', name: 'user' }}
                onChangeText={(val) => updateAuthCredentials('username', val)}
                style={{ marginBottom: 0, paddingHorizontal: 10 }}
            />

            <Input
                secureTextEntry={true}
                value={authCredentials.password}
                placeholder="Password"
                onChangeText={(val) => updateAuthCredentials('password', val)}
                leftIcon={{ type: 'font-awesome', name: 'lock' }}
                style={{ marginBottom: 0, paddingHorizontal: 10 }}
            />

            <Button
                title="LOGIN"
                onPress={handleLogin}
                enabled={!auth.isLoading}
                loading={auth.isLoading}
                loadingProps={{
                    size: 'small',
                    color: 'rgba(111, 202, 186, 1)',
                }}
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

            {auth.error && <Text style={{ fontSize: 14, color: 'red'}}>{auth.error}</Text>}
        </View>
    );
};

export default LoginScreen;
