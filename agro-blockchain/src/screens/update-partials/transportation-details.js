import {Button, ListItem} from "@rneui/themed";
import React from "react";
import {View} from "react-native";

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

const TransportationDetail = ({data}) => {
    return (
        <ListItem.Content containerStyle={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
            <ListItem.Title>{ data.name}</ListItem.Title>
            <ListItem.Subtitle>{ data.notes}</ListItem.Subtitle>
            <ListItem.Subtitle>{ data.responsiblePerson}, {data.date}</ListItem.Subtitle>
        </ListItem.Content>
    )
}

export const UpdateTransportationDetails = ({ transportationDetail }) => {
    return (
        <>
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
            />
            {transportationDetail.map((l, i) => (
                <View key={i}>
                    <ListItem.Swipeable
                        rightContent={(reset) => (
                            <EditBtn onPress={() => console.log(l.id)} />
                        )}
                    >
                        <TransportationDetail data={l.departure} />

                    </ListItem.Swipeable>

                    <ListItem.Swipeable
                        rightContent={(reset) => (
                            <EditBtn onPress={() => console.log(l.id)} />
                        )}
                    >
                        <TransportationDetail data={l.destination} />
                    </ListItem.Swipeable>
                </View>
            ))}
        </>
    )
}