import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import { getUserData } from '../services/apiService';
import { useAppContext } from '../context/AppContext';

const ProfileScreen = () => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { state } = useAppContext();

    useEffect(() => {
        // Fetch user data from API
        const fetchUserData = async () => {
            try {
                const response = await getUserData(state?.userToken ?? '');
                // console.log("response: ", JSON.stringify(response));
                const { result, name, mobile, type, email, token, status } = response;
                setUserData(response);
            } catch (err) {
                setError('Failed to load user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="blue" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* <Text style={styles.header}>Profile</Text> */}
            <View style={styles.profileItem}>
                <Text style={styles.label}>User Name:</Text>
                <Text style={styles.value}>{userData.name}</Text>
            </View>
            <View style={styles.profileItem}>
                <Text style={styles.label}>Mobile #:</Text>
                <Text style={styles.value}>{userData.mobile}</Text>
            </View>
            <View style={styles.profileItem}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>
                    {userData.email} <Text style={styles.verified}>Verified</Text>
                </Text>
            </View>
            {/* <View style={styles.profileItem}>
                <Text style={styles.label}>License Key:</Text>
                <Text style={styles.value}>{userData.licenseKey}</Text>
            </View> */}
            <View style={styles.profileItem}>
                <Text style={styles.label}>User Type:</Text>
                <Text style={styles.value}>{userData.type}</Text>
            </View>
            {/* <View style={styles.profileItem}>
                <Text style={styles.label}>Reviewed by:</Text>
                <Text style={styles.value}>{userData.reviewedBy}</Text>
            </View> */}
            {/* <View style={styles.profileItem}>
                <Text style={styles.label}>Access Level:</Text>
                <Text style={styles.value}>{userData.accessLevel}</Text>
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderColor: '#ccc',
    },
    profileItem: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        width: 120,
        fontSize: 16,
    },
    value: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    verified: {
        color: 'green',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});

export default ProfileScreen;
