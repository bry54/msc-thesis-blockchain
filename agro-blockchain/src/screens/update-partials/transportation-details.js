import {Button, Divider, Icon, Input, ListItem, Overlay, Text} from "@rneui/themed";
import React, {useEffect, useState} from "react";
import {StyleSheet, View} from "react-native";
import axios from "axios";
import {API_HOST} from "../../store/constants";
import {useSelector} from "react-redux";
import {Picker} from "@react-native-picker/picker";

const RightSwipeActions = ({ onPress, onApprove=false }) =>{
    return (
        <View style={{ flex: 1, flexDirection: "row" }}>
            <Button
                title="Edit"
                onPress={ onPress }
                iconPosition="top"
                icon={{ name: 'edit', color: 'white' }}
                buttonStyle={{ minHeight: '100%', backgroundColor: 'blue' }}
            />

            {onApprove && <Button
                title={'Confirm'}
                onPress={onApprove}
                iconPosition="top"
                icon={{name: 'check', color: 'white'}}
                buttonStyle={{minHeight: '100%', backgroundColor: 'green'}}
            />}
        </View>
    )
}

const LeftSwipeActions = ({ onPress }) => {
    return (
        <Button
            title="Delete"
            onPress={onPress}
            icon={{ name: 'trash', color: 'white', type: 'font-awesome' }}
            buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
        />
    )
}

const TransportationDetail = ({ data, icon }) => {
    return (
        <>
            <Icon type='font-awesome-5' name={icon} size={20} style={{ marginRight: 10 }} />
            <ListItem.Content containerStyle={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                <ListItem.Title>{ data?.name}</ListItem.Title>
                <ListItem.Subtitle>{ data?.notes}</ListItem.Subtitle>
                <ListItem.Subtitle>{ data?.responsiblePerson?.fullName}, {data?.date}</ListItem.Subtitle>
            </ListItem.Content>
        </>
    )
}

export const UpdateTransportationDetails = ({ product }) => {
    const [editableElement, setEditableElement] = useState(null);
    const [records, setRecords] = useState([]);
    const [selectedRec, setSelectedRec] = useState(null);
    const [visible, setVisible] = useState(false);
    const [locations, setLocations] = useState([]);

    const [formData, setFormData] = useState({});

    const { user } = useSelector((state) => state.auth);

    const reqConfigs = {
        headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${user?.accessToken}`
        }
    }

    const handleSelectedRecordChange = (rec) =>{
        setSelectedRec((prevState) => ({
            ...prevState,
            ...rec
        }))

        setFormData((prevState) =>({
            id: rec?.id,
            departure: {
                notes: rec?.departure?.notes || '',
                stakeholderId: rec?.departure?.stakeholderId || '',
                date: rec?.departure?.date,
            },
            destination: {
                notes: rec?.destination?.notes || '',
                stakeholderId: rec?.destination?.stakeholderId || '',
                date: rec?.destination?.date,
            },
        }));
    }

    const handleRecordChanges = (parent, prop, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [parent]: {
                ...prevState[parent],
                [prop]: value,
            },
        }));
    };

    const queryRecords = async () =>{
        try{
            const response = await axios.get(`${API_HOST}/transportation-details/${product.id}`, reqConfigs)
            const data = response.data
            setRecords(data)
        } catch (e) {
            console.log(e, 'ERROR FETCHING DETAILS')
        }

        try {
            const locResponse = await axios.get(`${API_HOST}/stakeholder`, reqConfigs)
            const locations = locResponse.data.data
            setLocations(locations)
        } catch (e) {
            console.log(e, 'ERROR FETCHING LOCATIONS')
        }
    }

    const patchRec = async (data) => {
        if (data?.isConfirming){
            await axios.patch(`${API_HOST}/transportation-details/${product.id}/update/${data.id}`, {
                isConfirming: true
            }, reqConfigs)
        } else {
            await axios.patch(`${API_HOST}/transportation-details/${product.id}/update/${selectedRec.id}`, formData, reqConfigs)
        }


        queryRecords();
    }

    const deleteRec = async (id) => {
        await axios.delete(`${API_HOST}/transportation-details/${product.id}/delete/${id}`, reqConfigs)
        queryRecords();
    }

    const createRec = async () => {
        const data = formData;
        delete data.id

        await axios.post(`${API_HOST}/transportation-details/${product.id}/create`, data, reqConfigs)
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
                <View style={styles.container}>
                    <View>
                        <Text style={{ fontWeight: 'bold'}}>Departure Organization:</Text>
                        <Picker
                            selectedValue={formData?.departure?.stakeholderId || null}
                            style={styles.picker}
                            onValueChange={(value) => handleRecordChanges('departure', 'stakeholderId', value)}
                        >
                            <Picker.Item label="Select Origin" value={null} />
                            {
                                locations.map(l => (
                                    <Picker.Item key={l.id} label={l.name} value={l.id} />
                                ))
                            }
                        </Picker>

                        <Text style={{ fontWeight: 'bold'}}>Departure Notes:</Text>
                        <Input
                            style={styles.input}
                            value={formData?.departure?.notes}
                            onChangeText={(value) => handleRecordChanges('departure', 'notes', value)}
                        />
                    </View>

                    <View>
                        <Text style={{ fontWeight: 'bold'}}>Destination Organization:</Text>
                        <Picker
                            selectedValue={formData?.destination?.stakeholderId || null}
                            style={styles.picker}
                            onValueChange={(value) => handleRecordChanges('destination', 'stakeholderId', value)}
                        >
                            <Picker.Item label="Select Destination" value={null} />
                            {
                                locations.map(l => (
                                    <Picker.Item key={l.id} label={l.name} value={l.id} />
                                ))
                            }
                        </Picker>

                        <Text style={{ fontWeight: 'bold'}}>Destination Notes:</Text>
                        <Input
                            style={styles.input}
                            value={formData?.destination?.notes}
                            onChangeText={(value) => handleRecordChanges('destination', 'notes', value)}
                        />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10}}>
                    <Button
                        size="sm"
                        title="Save"
                        buttonStyle={{ paddingHorizontal: 20 }}
                        onPress={() => {
                            if (formData?.id) {
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
                    handleSelectedRecordChange({departure: {}, destination: {} });
                    setEditableElement(null);
                    setVisible(true)
                }}
            />

            {records.map((l, i) => (
                <View key={i}>
                    <ListItem.Swipeable
                        leftContent={(reset) => (
                            <LeftSwipeActions
                                onPress={async () => {
                                    await handleSelectedRecordChange(l);
                                    setVisible(false);
                                    deleteRec(l.id);
                                    reset()
                                }}
                            />
                        )}
                        rightContent={(reset) => (
                            <RightSwipeActions onPress={() => {
                                reset();
                                setVisible(true);
                                handleSelectedRecordChange(l)
                                setEditableElement('departure');
                            }} />
                        )}
                    >
                        <TransportationDetail
                            data={l?.departure}
                            icon={'upload'}
                        />

                    </ListItem.Swipeable>

                    <Icon name='long-arrow-down' type='font-awesome' size={18} style={{ backgroundColor: 'white' }} />

                    <ListItem.Swipeable
                        rightContent={(reset) => (
                            <RightSwipeActions
                                onApprove={() => {
                                    reset()
                                    handleSelectedRecordChange(l)
                                    patchRec({isConfirming: true, id: l.id})
                                }}
                                onPress={() => {
                                    reset();
                                    setVisible(true);
                                    handleSelectedRecordChange(l)
                                    setEditableElement('destination')
                                }} />
                        )}
                    >
                        <TransportationDetail
                            data={l?.destination}
                            icon={'download'}
                        />
                    </ListItem.Swipeable>

                    <Divider style={{height: 10}}></Divider>
                </View>
            ))}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
    },
    picker: {
        width: '100%',
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    input:{

    }
});