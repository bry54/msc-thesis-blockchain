import {Button, Divider, Icon, Input, ListItem, Overlay, Text} from "@rneui/themed";
import React, {useEffect, useState} from "react";
import {View, StyleSheet} from "react-native";
import axios from "axios";
import {API_HOST} from "../../store/constants";
import { Dropdown } from 'react-native-element-dropdown';

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

const LocationSelect = ({ options, location, onChangeFn }) => {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    let opts = options

    if (location === 'destination'){
        opts = options.filter(option => option.id !== value);
    }

    return (
        <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'transparent', borderWidth: 0 }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={ opts }
            maxHeight={300}
            labelField="name"
            valueField="id"
            placeholder={!isFocus ? `Select ${location}` : '...'}
            searchPlaceholder="Search..."
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
                setValue(`${item.id}`);
                setIsFocus(false);
                const value = {
                    name: `${item.name}, ${item.type}`,
                    address: item.location,
                }
                // Create a new object based on the updates needed
                const updates = Object.keys(value).reduce((acc, v) => {
                    acc[v] = value[v];
                    return acc;
                }, {});

                onChangeFn(location, 'obj', updates);
            }}
            renderLeftIcon={() => (
                <Icon
                    style={styles.icon}
                    color={isFocus ? 'blue' : 'black'}
                    name="place"
                    size={20}
                />
            )}
        />
    )
}

export const UpdateTransportationDetails = ({ product }) => {
    const [editableElement, setEditableElement] = useState(null);
    const [records, setRecords] = useState([]);
    const [selectedRec, setSelectedRec] = useState(null);
    const [visible, setVisible] = useState(false);
    const [locations, setLocations] = useState([]);

    const queryRecords = async () =>{
        const response = await axios.get(`${API_HOST}/transportation-details/${product.id}`)
        const data = response.data

        const locResponse = await axios.get(`${API_HOST}/stakeholder`)
        const locations = locResponse.data.data

        setRecords(data)
        setLocations(locations)
    }

    const updateRecDetails = (mainProp, prop, value) => {
        if (prop === 'obj'){
            // Update the state with all changes at once
            setSelectedRec(prevState => {
                const currentMainPropState = prevState[mainProp] || {};
                return {
                    ...prevState,
                    [mainProp]: {
                        ...currentMainPropState,
                        ...value
                    }
                }
            });
        } else {
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
                                <Text h4 style={{marginVertical: 10, fontWeight: 'light'}}> Provide transportation data</Text>
                                <Divider/>
                                <View style={{marginVertical: 10}}>
                                    <LocationSelect
                                        location='departure'
                                        options={locations}
                                        onChangeFn={updateRecDetails}
                                    />

                                    <Input
                                        placeholder='Enter departure notes'
                                        value={selectedRec?.departure.notes || ''}
                                        onChangeText={value => updateRecDetails('departure', 'notes', value)}
                                    />
                                </View>

                                {selectedRec?.departure.name && <View style={{marginVertical: 10}}>
                                    <LocationSelect
                                        location='destination'
                                        options={locations}
                                        onChangeFn={updateRecDetails}
                                    />
                                    <Input
                                        placeholder='Enter destination notes'
                                        value={selectedRec?.destination.notes || ''}
                                        onChangeText={value => updateRecDetails('destination', 'notes', value)}
                                    />
                                </View>}
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

                    <Icon name='long-arrow-down' type='font-awesome' size={18} style={{ backgroundColor: 'white' }} />

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
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderBottomWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
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
});