import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {Card} from "@rneui/themed";

const UpdateDetailsScreen = () => {
    return (
        <ScrollView>
            <Card containerStyle={{ marginTop: 15 }}>
                <Card.Title>General Information</Card.Title>
                <Card.Divider />
                <Text style={styles.fonts} h1>
                    h1 Heading
                </Text>
                <Text style={styles.fonts} h2>
                    h2 Heading
                </Text>
                <Text style={styles.fonts} h3>
                    h3 Heading
                </Text>
                <Text style={styles.fonts} h4>
                    h4 Heading
                </Text>
                <Text style={styles.fonts}>Normal Text</Text>
            </Card>

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
