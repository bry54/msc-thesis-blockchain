import React from 'react';
import {ScrollView, View} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {Button, Text, Skeleton, Divider, Icon, Card, ListItem} from '@rneui/themed';
import moment from "moment";

const MainScreen = () => {
    const {isLoggedIn, user } = useSelector((state) => state.auth);
    const qrScanState = useSelector((state) => state.qrScan);
    const navigation = useNavigation();

    const { product, isLoading } = qrScanState;

    return (
        <ScrollView>
            <View style={{ marginVertical: 0 }}>
                {
                    isLoading ? (
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Skeleton width={120} height={40} />
                            <Skeleton circle width={40} height={40} />
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
                                <Card.Image
                                    style={{ padding: 0 }}
                                    source={{
                                        uri:
                                            'https://awildgeographer.files.wordpress.com/2015/02/john_muir_glacier.jpg',
                                    }}
                                />
                                <View style={{ marginBottom: 10 }}>
                                    <ListItem bottomDivider>
                                        <ListItem.Content style={{ flexDirection: 'row', paddingVertical: 10, justifyContent: 'space-between' }}>
                                            <View>
                                                <ListItem.Title>Planting</ListItem.Title>
                                                <ListItem.Subtitle>
                                                    { product?.planting?.date ? moment(product.planting.date).format('dd/mm/yy') : `--` }
                                                </ListItem.Subtitle>

                                                <ListItem.Subtitle>
                                                    { product?.planting?.quantity ? product.planting.quantity : '--' }
                                                </ListItem.Subtitle>
                                            </View>

                                            <View>
                                                <ListItem.Title>Harvesting</ListItem.Title>
                                                <ListItem.Subtitle>
                                                    { product?.harvesting?.date ? moment(product.harvesting.date).format('dd/mm/yy') : `--` }
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
                                            <ListItem.Subtitle>President</ListItem.Subtitle>
                                        </ListItem.Content>
                                    </ListItem>

                                    <ListItem bottomDivider>
                                        <ListItem.Content>
                                            <ListItem.Title>Latest Pricing</ListItem.Title>
                                            <ListItem.Subtitle>President</ListItem.Subtitle>
                                        </ListItem.Content>
                                    </ListItem>

                                    <ListItem bottomDivider>
                                        <ListItem.Content>
                                            <ListItem.Title>Latest Regulation Check</ListItem.Title>
                                            <ListItem.Subtitle>President</ListItem.Subtitle>
                                        </ListItem.Content>
                                    </ListItem>
                                </View>

                                <Divider />

                                <Button
                                    title="View Product History"
                                    onPress={() => navigation.navigate('History', {
                                        product: product
                                    })}
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
                                {isLoggedIn ? (
                                    <>
                                        <Button
                                            title="Update Product Details"
                                            onPress={() => navigation.navigate('UpdateDetails')}
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

            <Text style={{ color: 'red', textAlign: 'center', padding: 20, lineHeight: 25 }}>
                { isLoggedIn ? `Logged in as: ${ user?.fullName }` : `You need to be logged in to perform administrative operations`}
            </Text>
        </ScrollView>
    );
};

export default MainScreen;
