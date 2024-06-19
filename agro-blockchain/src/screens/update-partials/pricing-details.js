import {Button, Icon, Input, ListItem, Overlay} from "@rneui/themed";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {API_HOST} from "../../store/constants";
import {View} from "react-native";

const EditBtn = ({onPress}) =>{
    return (
        <Button
            title="Edit"
            onPress={onPress}
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

export const UpdatePricingDetails = ({ product }) =>{
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
        const response = await axios.get(`${API_HOST}/pricing-details/${product.id}`)
        const data = response.data

        setRecords(data)
    }

    const patchRec = async () => {
        await axios.patch(`${API_HOST}/pricing-details/${product.id}/update/${selectedRec.id}`, selectedRec)
        queryRecords();
    }

    const deleteRec = async () => {
        await axios.delete(`${API_HOST}/pricing-details/${product.id}/delete/${selectedRec.id}`)
        queryRecords();
    }

    const createRec = async () => {
        await axios.post(`${API_HOST}/pricing-details/${product.id}/create`, selectedRec)
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
                        placeholder='Enter price'
                        value={selectedRec?.pricePerUnit || ''}
                        onChangeText={value => updateRecDetails('pricePerUnit', value)}
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
                title="Add Pricing"
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
                                console.log('HERE', l, selectedRec)
                                setVisible(false);
                                deleteRec();
                                reset()
                            }}
                        />
                    )}
                    rightContent={(reset) => (
                        <EditBtn onPress={() => {
                            reset();
                            updateSelectedRec(l)
                            setVisible(true);
                        }} />
                    )}
                >
                    <Icon type='font-awesome-5' name={'map-marker'} size={20} />
                    <ListItem.Content>
                        <ListItem.Title> {l.stakeHolder?.name || '--'} </ListItem.Title>
                        <ListItem.Subtitle> {l.stakeHolder?.type || '--'}</ListItem.Subtitle>
                        <ListItem.Subtitle> {l.pricePerUnit || '--'}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem.Swipeable>
            ))}
        </>
    )
}