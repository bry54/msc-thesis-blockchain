import {Button, Divider, Input, ListItem, Overlay, Text} from "@rneui/themed";
import React, {useEffect, useState} from "react";
import {View} from "react-native";
import axios from "axios";
import {API_HOST} from "../../store/constants";

const EditBtn = ({ onPress }) =>{
    return (
        <Button
            title="Edit"
            onPress={ onPress }
            icon={{ name: 'edit', color: 'white' }}
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

const TransportationDetail = ({ data }) => {
    return (
        <ListItem.Content containerStyle={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
            <ListItem.Title>{ data?.name}</ListItem.Title>
            <ListItem.Subtitle>{ data?.notes}</ListItem.Subtitle>
            <ListItem.Subtitle>{ data?.responsiblePerson}, {data?.date}</ListItem.Subtitle>
        </ListItem.Content>
    )
}

export const UpdateTransportationDetails = ({ product }) => {
    const [editableElement, setEditableElement] = useState(null);
    const [records, setRecords] = useState([]);
    const [selectedRec, setSelectedRec] = useState(null);
    const [visible, setVisible] = useState(false);

    const queryRecords = async () =>{
        const response = await axios.get(`${API_HOST}/transportation-details/${product.id}`)
        const data = response.data

        setRecords(data)
    }

    const updateRecDetails = (mainProp, prop, value) => {
        setSelectedRec((prev) => (
            {
                ...prev,
                [mainProp]: {
                    ...prev[mainProp],
                    [prop]: value
                }
            }
        ));
    }

    const patchRec = async () => {
        await axios.patch(`${API_HOST}/transportation-details/${product.id}/update/${selectedRec.id}`, selectedRec)
        queryRecords();
    }

    const deleteRec = async () => {
        await axios.delete(`${API_HOST}/transportation-details/${product.id}/delete/${selectedRec.id}`)
        queryRecords();
    }

    const createRec = async () => {
        await axios.post(`${API_HOST}/transportation-details/${product.id}/create`, selectedRec)
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
                    {
                        selectedRec?.id && (<Input
                            placeholder='Enter transportation notes'
                            value={selectedRec?.[editableElement]?.notes || ''}
                            onChangeText={value => updateRecDetails(editableElement, 'notes', value)}
                        />)
                    }

                    {
                        !selectedRec?.id && (
                            <>
                                <Text>From: </Text>
                                <Input
                                    placeholder='Enter departure notes'
                                    value={selectedRec?.departure.notes || ''}
                                    onChangeText={value => updateRecDetails('departure', 'notes', value)}
                                />

                                <Divider/>

                                <Text>From: </Text>
                                <Input
                                    placeholder='Enter destination notes'
                                    value={selectedRec?.destination.notes || ''}
                                    onChangeText={value => updateRecDetails('destination', 'notes', value)}
                                />
                            </>
                        )
                    }
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
                        onPress={() => {
                            setVisible(false);
                            setEditableElement(null)
                        }}
                    />
                </View>
            </Overlay>

            <Button
                title="Add Transportation"
                buttonStyle={{
                    backgroundColor: 'rgba(78, 116, 289, 1)',
                }}
                type="outline"
                raised
                titleStyle={{ color: '#fff' }}
                containerStyle={{
                    justifyContent: 'center',
                }}
                onPress={() =>{
                    setSelectedRec({departure: {}, destination: {} });
                    setEditableElement(null);
                    setVisible(true)
                }}
            />

            {records.map((l, i) => (
                <View key={i}>
                    <ListItem.Swipeable
                        leftContent={(reset) => (
                            <DeleteBtn
                                onPress={() => {
                                    setSelectedRec(l);
                                    setVisible(false);
                                    deleteRec();
                                    reset()
                                }}
                            />
                        )}
                        rightContent={(reset) => (
                            <EditBtn onPress={() => {
                                reset();
                                setVisible(true);
                                setSelectedRec(l)
                                setEditableElement('departure');
                            }} />
                        )}
                    >
                        <TransportationDetail
                            data={l.departure}
                        />

                    </ListItem.Swipeable>

                    <ListItem.Swipeable
                        rightContent={(reset) => (
                            <EditBtn onPress={() => {
                                reset();
                                setVisible(true);
                                setSelectedRec(l)
                                setEditableElement('destination')
                            }} />
                        )}
                    >
                        <TransportationDetail
                            data={l.destination} />
                    </ListItem.Swipeable>
                </View>
            ))}
        </>
    )
}