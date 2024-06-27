import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Icon, ListItem} from "@rneui/themed";
import {UpdateTransportationDetails} from "./update-partials/transportation-details";
import {UpdatePricingDetails} from "./update-partials/pricing-details";
import {UpdateRegulatoryChecks} from "./update-partials/regulatory-checks";
import {UpdateProductDetails} from "./update-partials/product-details";

const UpdateDetailsScreen = ({product}) => {

    const [expanded, setExpanded] = useState([0]);
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
                                <UpdateProductDetails product = {product} />
                            )
                        }

                        {
                            group.dataProp === 'regulatoryChecks' && (
                                <UpdateRegulatoryChecks product={product} />
                            )
                        }

                        {
                            group.dataProp === 'transportationDetail' && (
                                <UpdateTransportationDetails product={product} />
                            )
                        }

                        {
                            group.dataProp === 'pricingDetail' && (
                                <UpdatePricingDetails product={product} />
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
