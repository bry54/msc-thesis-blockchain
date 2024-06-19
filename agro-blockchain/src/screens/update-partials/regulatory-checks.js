import {Button, Icon, Input, ListItem, Overlay, Text} from "@rneui/themed";
import React, {useEffect, useState} from "react";
import {View} from "react-native";
import axios from "axios";
import {API_HOST} from "../../store/constants";

const EditBtn = ({ onPress }) =>{
    return (
        <Button
            title="Edit"
            onPress={onPress}
            icon={{ name: 'edit', color: 'white', type: 'font-awesome' }}
            buttonStyle={{ minHeight: '100%', backgroundColor: 'blue' }}
        />
    )
}

const DeleteBtn = ({ onPress }) => {
    return (
        <Button
            title="Delete"
            onPress={onPress}
            icon={{ name: 'trash', color: 'white', type: 'font-awesome' }}
            buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
        />
    )
}

export const UpdateRegulatoryChecks = ({ product }) => {
    const [records, setRecords] = useState([]);
    const [selectedRec, setSelectedRec] = useState(null);
    const [visible, setVisible] = useState(false);

    const updateSelectedRec = (value) => {
        setSelectedRec((prevState) => ({
            ...prevState,
            ...value
        }));
    }

    const updateRecDetails = (prop, value) => {
        setSelectedRec((prev) => (
            {
                ...prev,
                [prop]: value
            }
        ));
    }

    const queryRecords = async () =>{
        const response = await axios.get(`${API_HOST}/regulatory-checks/${product.id}`)
        const data = response.data

        setRecords(data)
    }

    const patchRec = async () => {
        await axios.patch(`${API_HOST}/regulatory-checks/${product.id}/update/${selectedRec.id}`, selectedRec)
        queryRecords();
    }

    const deleteRec = async () => {
        await axios.delete(`${API_HOST}/regulatory-checks/${product.id}/delete/${selectedRec.id}`)
        queryRecords();
    }

    const createRec = async () => {
        await axios.post(`${API_HOST}/regulatory-checks/${product.id}/create`, selectedRec)
        queryRecords();
    }

    useEffect(() => {
        queryRecords();
    },[]);

    return (
        <>
            <Overlay
                overlayStyle={{ width: '95%'}}
                isVisible={visible} onBackdropPress={() => setVisible(false)}>
                <View style={{}}>
                    <Input
                        placeholder='Enter check notes'
                        value={selectedRec?.notes || ''}
                        onChangeText={value => updateRecDetails('notes', value)}
                    />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10}}>
                    <Button
                        size="sm"
                        title="Save"
                        buttonStyle={{ paddingHorizontal: 20 }}
                        onPress={() => {
                            if (selectedRec?.id) {
                                patchRec()
                            } else {
                                createRec()
                            }
                            setVisible(false)
                        }}
                    />

                    <Button
                        buttonStyle={{ paddingHorizontal: 20, backgroundColor: 'grey' }}
                        size="sm"
                        title="Cancel"
                        onPress={() =>setVisible(false)}
                    />
                </View>
            </Overlay>

            <Button
                title="Add Check"
                buttonStyle={{
                    backgroundColor: 'rgba(78, 116, 289, 1)',
                }}
                type="outline"
                raised
                titleStyle={{ color: '#fff' }}
                containerStyle={{
                    justifyContent: 'center',
                }}
                onPress={() => {
                    updateSelectedRec({});
                    setVisible(true);
                }}
            />
            {records.map((l, i) => (
                <ListItem.Swipeable
                    key={i}
                    leftContent={(reset) => (
                        <DeleteBtn
                            onPress={() => {
                                updateSelectedRec(l);
                                setVisible(false);
                                deleteRec();
                                reset()
                            }}
                        />
                    )}
                    rightContent={(reset) => (
                        <EditBtn
                            onPress={() => {
                                updateSelectedRec(l);
                                setVisible(true);
                                reset()
                            }}
                        />
                    )}
                >
                    <Icon type='font-awesome-5' name={'clipboard-check'} size={20} style={{ marginRight: 10 }} />
                    <ListItem.Content>
                        <ListItem.Title>{ l.notes}</ListItem.Title>
                        <ListItem.Subtitle>{ l?.signedBy?.fullName}, {l?.date}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem.Swipeable>
            ))}
        </>
    )
}