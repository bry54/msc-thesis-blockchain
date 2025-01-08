import {Text, View} from "react-native";
import React, {useState} from "react";
import {Button, Icon, Overlay, ListItem} from "@rneui/themed";
import {useSelector} from "react-redux";
import moment from "moment";

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

export const UpdateProductDetails = ({ product }) => {
    const [visible, setVisible] = useState(false);
    const { user } = useSelector((state) => state.auth);

    const reqConfigs = {
        headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${user?.accessToken}`
        }
    }

    return (
        <View style={{ padding: 0}} >
            <ListItem.Swipeable
                rightContent={(reset) => (
                    <EditBtn onPress={() => setVisible(false)} />
                )}
            >
                <ListItem.Content>
                    <ListItem.Title>Name: { product.product.name}</ListItem.Title>
                    <ListItem.Subtitle>Category: { product.product.category}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem.Swipeable>

            <ListItem.Swipeable
                rightContent={(reset) => (
                    <EditBtn onPress={() => setVisible(false)} />
                )}
            >
                <ListItem.Content>
                    <ListItem.Title> Planted Date: {product?.planting?.date ? moment(product.planting.date).format('L'):  '--'}  </ListItem.Title>
                    <ListItem.Title> Planted Quantity: {product.planting.quantity}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem.Swipeable>

            <ListItem.Swipeable
                rightContent={(reset) => (
                    <EditBtn onPress={() => setVisible(false)} />
                )}
            >
                <ListItem.Content>
                    <ListItem.Title> Harvested Date: {product?.harvesting?.date ? moment(product.harvesting.date).format('L') : '--'} </ListItem.Title>
                    <ListItem.Title> Harvested Quantity: {product?.harvesting?.quantity || '--'}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem.Swipeable>
        </View>
    )
}