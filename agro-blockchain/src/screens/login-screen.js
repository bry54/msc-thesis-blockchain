// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/actions';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [authCredentials, setAuthCredentials] = useState({username: '', password: ''});
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const navigation = useNavigation();

    const handleLogin = async () => {
        await dispatch(login(authCredentials));
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
            <Text>Login</Text>
            <TextInput
                placeholder="Username"
                value={authCredentials.username}
                onChangeText={(val) => updateAuthCredentials('username', val)}
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, width: '80%', paddingHorizontal: 10 }}
            />

            <TextInput
                secureTextEntry={true}
                placeholder="Password"
                value={authCredentials.password}
                onChangeText={(val) => updateAuthCredentials('password', val)}
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, width: '80%', paddingHorizontal: 10 }}
            />

            <Button title="Login" onPress={handleLogin} />

            {auth.error && <Text style={styles.error}>{auth.error}</Text>}
        </View>
    );
};

export default LoginScreen;
