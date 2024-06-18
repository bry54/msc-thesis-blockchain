import {Button, ListItem} from "@rneui/themed";
import React from "react";

const EditBtn = () =>{
    return (
        <Button
            title="Edit"
            onPress={() => reset()}
            icon={{ name: 'edit', color: 'white' }}
            buttonStyle={{ minHeight: '100%', backgroundColor: 'blue' }}
        />
    )
}

export const UpdatePricingDetails = ({ pricingDetail }) =>{
    return (
        <>
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
            />
            {pricingDetail.map((l, i) => (
                <ListItem.Swipeable
                    key={i}
                    rightContent={(reset) => (
                        <EditBtn onPress={() => setVisible(false)} />
                    )}
                >
                    <ListItem.Content>
                        <ListItem.Title> {l.stakeHolder.name} </ListItem.Title>
                        <ListItem.Subtitle> {l.pricePerUnit }</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem.Swipeable>
            ))}
        </>
    )
}