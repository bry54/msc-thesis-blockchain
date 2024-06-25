import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation} from "@react-navigation/native";
import { useDispatch} from "react-redux";
import { queryOne} from "../store/actions";
import {FAB} from "@rneui/themed";

const QRScannerScreen = () => {
    const [facing, setFacing] = useState("back");
    const [permission, requestPermission] = useCameraPermissions();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const onSuccess = async (e) => {
        const id = e.data = 'e7331ece-ab36-4327-afd0-2a6fcd3b62b2'
        await dispatch(queryOne(id));

        navigation.navigate('Main');
    };

    if (permission){
        //onSuccess({})
    }

    if (!permission) {
        // Camera permissions are still loading.
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>Still loading camera permissions</Text>
            </View>
        )
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} onBarcodeScanned={onSuccess}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default QRScannerScreen;
