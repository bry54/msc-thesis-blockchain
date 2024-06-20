import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Icon, ListItem} from "@rneui/themed";
import {UpdateTransportationDetails} from "./update-partials/transportation-details";
import {UpdatePricingDetails} from "./update-partials/pricing-details";
import {UpdateRegulatoryChecks} from "./update-partials/regulatory-checks";
import {UpdateProductDetails} from "./update-partials/product-details";

const prod = {
    "id": "e7331ece-ab36-4327-afd0-2a6fcd3b62b2",
    "createdAt": "2024-06-20T09:59:37.929Z",
    "updatedDate": "2024-06-20T12:02:55.000Z",
    "deletedDate": null,
    "deletedBy": null,
    "createdBy": "b15c6056-f847-444e-9753-b44007d3337a",
    "updatedBy": "b15c6056-f847-444e-9753-b44007d3337a",
    "product": {
        "name": "Oranges",
        "category": "Citrus Fruit"
    },
    "origin": {
        "id": "263cfc84-9c63-487f-b1e7-87e8ba593c0e",
        "name": "Mahiya & Sons Wholesalers",
        "type": "FARM ORGANIZATION",
        "contactNumber": "+90 533 000 79 19",
        "location": "KKTC, Lefke"
    },
    "planting": {
        "quantity": "400 pieces",
        "date": "2024-06-16T21:00:00.000Z"
    },
    "harvesting": {},
    "regulatoryChecks": [],
    "transportationDetail": [],
    "pricingDetail": []
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
