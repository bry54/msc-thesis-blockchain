import {Text, View} from "react-native";
import React, {useState} from "react";
import {Button, Icon, Overlay, ListItem} from "@rneui/themed";

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

    return (
        <View style={{ padding: 10}} >
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
                    <ListItem.Title> Planted Date: {product.planting.date} </ListItem.Title>
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
                    <ListItem.Title> Harvested Date: {product?.harvesting?.date || '--'} </ListItem.Title>
                    <ListItem.Title> Harvested Quantity: {product?.harvesting?.quantity || '--'}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem.Swipeable>
        </View>
    )
}