import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';

import { useAppContext } from '../context/AppContext';
import { getMyTasks } from '../services/apiService';

const HomeScreen = () => {
    const { state } = useAppContext();
    const [myTasks, setMyTasks] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchMyTasks = async () => {
        const userToken = state?.userToken ?? '';
        console.log("userToken: ", userToken);
        try {
            const response = await getMyTasks(userToken);
            console.log("response: ", JSON.stringify(response));
            setMyTasks(response.data);
        } catch (err) {
            Alert.alert("Error", "Something Went Wrong");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMyTasks();
    }, []);

    if (loading) {
        <View style={styles.container}>
            <ActivityIndicator size="large" />
        </View>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Dashboard Coming Soon
                {/* {state.userToken
                    ? `Welcome! Activation Data: ${JSON.stringify(state.userToken)}`
                    : 'No Activation Data Found'} */}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    text: {
        fontSize: 18,
    },
});

export default HomeScreen;
