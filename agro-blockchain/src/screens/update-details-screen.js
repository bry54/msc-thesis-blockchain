import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Icon, ListItem} from "@rneui/themed";
import {UpdateTransportationDetails} from "./update-partials/transportation-details";
import {UpdatePricingDetails} from "./update-partials/pricing-details";
import {UpdateRegulatoryChecks} from "./update-partials/regulatory-checks";
import {UpdateProductDetails} from "./update-partials/product-details";

const prod = {
    "id": "d194b0c7-57bc-4c79-aa92-e1c49faf0b0e",
    "createdAt": "2024-06-13T10:52:01.950Z",
    "updatedDate": "2024-06-18T09:03:47.000Z",
    "deletedDate": null,
    "updatedBy": null,
    "product": {
        "name": "Oranges",
        "category": "Fruits"
    },
    "origin": {
        "name": "Mahiya & Sons",
        "type": "FARM ORGANIZATION",
        "contactNumber": "+2638347917",
        "location": "Beatrice, Zimbabwe"
    },
    "planting": {
        "quantity": "100",
        "date": "2024-06-13T13:49:06.897Z"
    },
    "harvesting": {},
    "regulatoryChecks": [
        {
            "notes": "This is from Swagger",
            "signedBy": {
                "fullName": "string",
                "username": "string",
                "password": "string",
                "stakeholderId": "string",
                "role": "FARMER"
            },
            "id": "a96862af-6e49-4f53-9197-a06b57a787a1",
            "date": "2024-06-18T12:03:47.595Z"
        }
    ],
    "transportationDetail": [
        {
            "departure": {
                "name": "Mahiya farm",
                "address": "Haspolat",
                "date": "18.06.2024",
                "notes": "Dispatching 200 Units",
                "responsiblePerson": "Brian Sithole"
            },
            "destination": {
                "name": "Molto Wholesalers",
                "address": "Kyrenia",
                "date": "18.06.2024",
                "notes": "Received 200 Units",
                "responsiblePerson": "Brenda Sithole"
            },
            "id": "8ede9583-1d71-4d7a-ab63-7507a3dc2fdd"
        }
    ],
    "pricingDetail": [
        {
            "stakeHolder": {
                "name": "string",
                "type": "FARM ORGANIZATION",
                "contactNumber": "string",
                "location": "string"
            },
            "pricePerUnit": "600 TL",
            "id": "ef2f78e8-fef8-4ee5-8450-e7786f6b7578"
        }
    ]
}

const UpdateDetailsScreen = () => {

    const [expanded, setExpanded] = useState([0])
    const groupings = [
        {
            name: 'General Information',
            dataProp: null,
            icon: 'info-circle'
        },
        {
            name: 'Regulatory Checks',
            dataProp: 'regulatoryChecks',
            icon: 'tasks'
        },
        {
            name: 'Transportation Information',
            dataProp: 'transportationDetail',
            icon: 'road'
        },
        {
            name: 'Pricing Information',
            dataProp: 'pricingDetail',
            icon: 'tags'
        },
    ]

    const updateExpandedState = (index) => {
        let arr = [...expanded]
        if (arr.includes(index)) {
            const i = expanded.indexOf(index);
            arr.splice(i, 1);
        } else {
            arr.push(index)
        }

        setExpanded(arr)
    }

    return (
        <ScrollView>
            {groupings.map((group, index) => (
                <ListItem.Accordion
                    containerStyle={{marginBottom: 10}}
                    key={index}
                    content={
                        <>
                            <Icon type='font-awesome-5' name={group.icon} size={20} />
                            <ListItem.Content>
                                <ListItem.Title style={{ paddingHorizontal: 10, fontWeight: 'bold'}}>{group.name}</ListItem.Title>
                            </ListItem.Content>
                        </>
                    }
                    isExpanded={expanded.includes(index)}
                    onPress={() => {
                        updateExpandedState(index);
                    }}
                    bottomDivider={true}
                >
                    <>
                        {
                            !group.dataProp && (
                                <UpdateProductDetails product = {prod} />
                            )
                        }

                        {
                            group.dataProp === 'regulatoryChecks' && (
                                <UpdateRegulatoryChecks product={prod} />
                            )
                        }

                        {
                            group.dataProp === 'transportationDetail' && (
                                <UpdateTransportationDetails product={prod} />
                            )
                        }

                        {
                            group.dataProp === 'pricingDetail' && (
                                <UpdatePricingDetails product={prod} />
                            )
                        }

                    </>
                </ListItem.Accordion>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fonts: {
        marginBottom: 8,
    },
    user: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    image: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    name: {
        fontSize: 16,
        marginTop: 5,
    },
});

export default UpdateDetailsScreen;
