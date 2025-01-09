import React, {useEffect, useState} from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {Button, Text, Skeleton, Divider, Icon, Card, ListItem} from '@rneui/themed';
import moment from "moment";
import axios from "axios";
import { API_HOST, WEB_APP } from '../store/constants';

const TransportationText = ({data}) =>{
    const length = data.length
    if (data && length){
        const info = data[length-1];
        return (
            <>From {info?.departure?.stakeholder?.name} to {info?.destination?.stakeholder?.name}</>
        )
    } else {
        return (
            <>- -</>
        )
    }
}

const RegulationsText = ({data}) =>{
    const length = data.length
    if (data && length){
        const info = data[length-1];
        return (
            <>{info?.notes} - {info?.signedBy?.stakeholder?.name}</>
        )
    } else {
        return (
            <>- -</>
        )
    }
}

const PricingText = ({data}) =>{
    const length = data.length
    if (data && length){
        const info = data[length-1];
        return (
            <>{info?.stakeHolder?.name} @ {info?.pricePerUnit}</>
        )
    } else {
        return (
            <>- -</>
        )
    }
}


const MainScreen = ({ route }) => {
    const {isLoggedIn, user } = useSelector((state) => state.auth);
    const navigation = useNavigation();
    const [product, setProduct] = useState(null);

    let {productId} = route.params;

    const setActiveProduct = async () =>{
        try {
          const response = await axios.get(`${API_HOST}/production/${productId}`)
          const data = response.data
          setProduct(data)
        } catch (e) {
          console.error(e, 'ERROR FETCHING PRODUCT')
        }
    }

    useEffect(() => {
        setActiveProduct();
    },[]);

    return (
        <ScrollView contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
            padding: 16
        }}>
            <View style={{ marginVertical: 0, flex: 1 }}>
                {
                    !product ? (
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Text>Product not found</Text>
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'column' }}>
                            <Card containerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Card.Title containerStyle={{ alignItems: 'center' }}>
                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                        <Text>{ product.product.name} - { product.product.category}</Text>
                                        <Text>{ product.origin.name }</Text>
                                    </View>
                                </Card.Title>
                                <Card.Divider />
                                <View style={{ marginBottom: 10 }}>
                                    <ListItem bottomDivider>
                                        <ListItem.Content style={{ flexDirection: 'row', paddingVertical: 10, justifyContent: 'space-between' }}>
                                            <View>
                                                <ListItem.Title>Date Planted</ListItem.Title>
                                                <ListItem.Subtitle>
                                                    { product?.planting?.date ? moment(product.planting.date).format('L') : `--` }
                                                </ListItem.Subtitle>

                                                <ListItem.Subtitle>
                                                    { product?.planting?.quantity ? product.planting.quantity : '--' }
                                                </ListItem.Subtitle>
                                            </View>

                                            <View>
                                                <ListItem.Title>Date Harvested</ListItem.Title>
                                                <ListItem.Subtitle>
                                                    { product?.harvesting?.date ? moment(product.harvesting.date).format('L') : `--` }
                                                </ListItem.Subtitle>

                                                <ListItem.Subtitle>
                                                    { product?.harvesting?.quantity ? product.harvesting.quantity : '--' }
                                                </ListItem.Subtitle>
                                            </View>
                                        </ListItem.Content>
                                    </ListItem>

                                    <ListItem bottomDivider>
                                        <ListItem.Content>
                                            <ListItem.Title>Latest Transportation</ListItem.Title>
                                            <ListItem.Subtitle>
                                                <TransportationText
                                                    data={product.transportationDetail}
                                                />
                                            </ListItem.Subtitle>
                                        </ListItem.Content>
                                    </ListItem>

                                    <ListItem bottomDivider>
                                        <ListItem.Content>
                                            <ListItem.Title>Latest Pricing</ListItem.Title>
                                            <ListItem.Subtitle>
                                                <PricingText
                                                    data={product.pricingDetail}
                                                />
                                            </ListItem.Subtitle>
                                        </ListItem.Content>
                                    </ListItem>

                                    <ListItem bottomDivider>
                                        <ListItem.Content>
                                            <ListItem.Title>Latest Regulation Check</ListItem.Title>
                                            <ListItem.Subtitle>
                                                <RegulationsText
                                                    data={product.regulatoryChecks}
                                                />
                                            </ListItem.Subtitle>
                                        </ListItem.Content>
                                    </ListItem>
                                </View>

                                <Divider />

                                <Button
                                    title="View Product History"
                                    onPress={() => {
                                      navigation.navigate('History', {
                                        product: product,
                                      });
                                    }}
                                    titleStyle={{ fontWeight: '700' }}
                                    buttonStyle={{
                                        backgroundColor: 'rgba(92, 99,216, 1)',
                                        borderColor: 'transparent',
                                        borderWidth: 0,
                                        borderRadius: 5,
                                        paddingVertical: 10,
                                    }}
                                    containerStyle={{
                                        marginHorizontal: 50,
                                        marginVertical: 10,
                                    }}
                                />
                                {isLoggedIn ? (
                                    <>
                                        <Button
                                            title="Update Product Details"
                                            onPress={() => navigation.navigate('UpdateDetails', { product: product })}
                                            titleStyle={{ fontWeight: '700' }}
                                            buttonStyle={{
                                                backgroundColor: 'rgba(92, 99,216, 1)',
                                                borderColor: 'transparent',
                                                borderWidth: 0,
                                                borderRadius: 5,
                                                paddingVertical: 10,
                                            }}
                                            containerStyle={{
                                                marginHorizontal: 50,
                                                marginVertical: 10,
                                            }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            title="Login"
                                            onPress={() => navigation.navigate('Login')}
                                            titleStyle={{ fontWeight: '700' }}
                                            buttonStyle={{
                                                backgroundColor: 'rgba(92, 99,216, 1)',
                                                borderColor: 'transparent',
                                                borderWidth: 0,
                                                borderRadius: 5,
                                                paddingVertical: 10,
                                            }}
                                            containerStyle={{
                                                width: 200,
                                                marginHorizontal: 50,
                                                marginVertical: 10,
                                            }}
                                        />

                                    </>
                                )}
                            </Card>

                        </View>
                    )
                }
            </View>

            <Divider />

            <Text style={{ color: 'red', textAlign: 'center', padding: 20, lineHeight: 25, alignItems: 'center' }}>
                { isLoggedIn ? `Logged in as: ${ user?.fullName }` : `You need to be logged in to perform administrative operations`}
            </Text>
        </ScrollView>
    );
};

export default MainScreen;
