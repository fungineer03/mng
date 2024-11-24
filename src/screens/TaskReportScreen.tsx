import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, Platform, PermissionsAndroid } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { RadioButton, Checkbox, Button } from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import Toast from 'react-native-toast-message';

import { getReportData, updateReportData } from '../services/apiService';
import { useAppContext } from '../context/AppContext';
import { STATUS_SUCCESS } from '../utils/constants';
import { findIndex, isNil, isEqual } from 'lodash';

const TaskReportScreen = ({ navigation }) => {
    const route = useRoute(); // Access navigation parameters
    const { qrCode } = route.params; // Get QR code passed from the previous screen
    const [loading, setLoading] = React.useState(false);
    const [apiResponse, setApiResponse] = React.useState(null);
    const { state } = useAppContext();
    const [slotCheck, setSlotCheck] = React.useState('');
    const [selectedRecord, setSelectedRecord] = React.useState(null);
    const [updatedRecord, setUpdatedRecord] = React.useState(null);
    const [latitude, setLatitude] = React.useState(null);
    const [longitude, setLongitude] = React.useState(null);

    // const submitChangesToBackend = async () => {
    //     setLoading(true);
    //     const response = await updateReportData(state?.userToken || "", qrCode,);
    // }

    const getLocation = () => {
        if (Platform.OS === 'android') {
            // Request Permission for Android
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            ).then((granted) => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    Geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;
                            setLatitude(latitude);
                            setLongitude(longitude);
                            console.log('Location:', latitude, longitude);
                        },
                        (error) => {
                            console.error('Location Error:', error.message);
                            Alert.alert('Error', 'Failed to get location');
                        },
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                    );
                } else {
                    Alert.alert('Permission Denied', 'Location permission is required.');
                }
            });
        } else {
            // iOS - Directly Get Location
            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLatitude(latitude);
                    setLongitude(longitude);
                    console.log('Location:', latitude, longitude);
                },
                (error) => {
                    console.error('Location Error:', error.message);
                    Alert.alert('Error', 'Failed to get location');
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }
        handleSubmit();
    };

    const handleSubmit = async () => {
        if (!selectedRecord) {
            Alert.alert('Error', 'No record selected');
            return;
        }

        if (latitude === null || longitude === null) {
            Alert.alert('Error', 'Location not retrieved. Please try again.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                qrCode,
                latitude,
                longitude,
                updatedRecord: updatedRecord || selectedRecord,
            };
            const updatedData = updatedRecord || selectedRecord
            console.log('Submitting Payload:', payload);
            const newRecordTasksOnly = updatedData.tasks.map(task => ({ ...task, status: task.status !== 1 ? 0 : 1 }));
            const jprid = updatedData.jprid;

            const response = await updateReportData(state?.userToken || '', qrCode, String(latitude), String(longitude), jprid, newRecordTasksOnly);

            if (response.result === STATUS_SUCCESS) {
                Alert.alert('Success', response.message, [{
                    text: 'OK', onPress: () => navigation.navigate('Main')
                }]);
                setUpdatedRecord(null); // Clear updated state after submission
            } else {
                console.error('Submit Error:', response);
                Alert.alert('Error', 'Failed to submit data');
            }
        } catch (error) {
            console.error('Submit Error:', error);
            Alert.alert('Error', 'Failed to submit data');
        } finally {
            setLoading(false);
        }
    };

    const fetchApiData = async () => {
        try {
            setLoading(true);
            const response = await getReportData(state?.userToken || "", qrCode);
            console.log("response: ", JSON.stringify(response));
            if (response.result === STATUS_SUCCESS) {
                setApiResponse(response.record);
            }
            else {
                console.log('error in api respomnse');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // UseFocusEffect ensures the API is called every time the screen is navigated to
    // useFocusEffect(
    //     React.useCallback(() => {
    //         fetchApiData();
    //     }, [qrCode]) // Dependency array to ensure it runs when qrCode changes
    // );

    // Alternatively, useEffect can be used if the call is only required on the first render:
    useEffect(() => {
        fetchApiData();
    }, []);
    console.log("selectedRecord: ", selectedRecord);
    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : apiResponse && apiResponse.length > 0 ? (
                <>
                    <View style={styles.responseContainer}>
                        <Text style={styles.responseTitle}>Select Slot:</Text>
                        <RadioButton.Group value={slotCheck} onValueChange={() => { }}>
                            {apiResponse.map(record => (
                                <View style={styles.buttonContainer} onTouchEndCapture={() => {
                                    setSlotCheck(record.jprid);
                                    setSelectedRecord(record);
                                    setUpdatedRecord(null);
                                }}>
                                    <RadioButton
                                        key={record.jprid}
                                        value={record.jprid}
                                        color='black'
                                    />
                                    <Text style={styles.responseText}>{`${record.date}, ${record.starttime} - ${record.endtime}`}</Text>
                                </View>
                            ))}
                        </RadioButton.Group>
                    </View>
                    <ScrollView style={{ alignSelf: 'stretch' }}>
                        {selectedRecord && (
                            <View style={{ flex: 1, flexDirection: 'column', width: '100%', paddingTop: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={styles.responseText}>Start Time: </Text>
                                        <Text style={styles.responseText}>{selectedRecord?.starttime}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={styles.responseText}>End Time: </Text>
                                        <Text style={styles.responseText}>{selectedRecord?.endtime}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'column', justifyContent: 'space-between', paddingTop: 10 }}>
                                    <Text style={styles.responseTitle}>Mandatory: </Text>
                                    {(updatedRecord || selectedRecord).tasks.filter(task => task.type === "Mandatory").map(
                                        mandatoryTask => (
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }} onTouchEndCapture={() => {
                                                const { wkid } = mandatoryTask;
                                                const indexOfTaskToBeUpdated = findIndex((updatedRecord || selectedRecord).tasks, task => task.wkid === wkid);
                                                console.log("indexOfTaskToBeUpdated: ", indexOfTaskToBeUpdated);
                                                if (indexOfTaskToBeUpdated !== -1) {
                                                    const newRecord = { ...(updatedRecord || selectedRecord) };
                                                    newRecord.tasks = newRecord.tasks.map((task, index) =>
                                                        index === indexOfTaskToBeUpdated
                                                            ? { ...task, status: task.status === 1 ? 0 : 1 }
                                                            : task
                                                    );
                                                    setUpdatedRecord(newRecord);
                                                }
                                            }}>
                                                <Checkbox.Item label={''} color='black' status={mandatoryTask?.status === 1 ? 'checked' : 'unchecked'} />
                                                <Text style={styles.responseText}>{mandatoryTask?.category}</Text>
                                            </View>
                                        )
                                    )}
                                </View>
                                <View style={{ flexDirection: 'column', justifyContent: 'space-between', paddingTop: 10 }}>
                                    <Text style={styles.responseTitle}>Optional: </Text>
                                    {(updatedRecord || selectedRecord).tasks.filter(task => task.type === "Optional").map(
                                        (optionalTask) => (
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }} onTouchEndCapture={() => {
                                                const { wkid } = optionalTask;
                                                const indexOfTaskToBeUpdated = findIndex((updatedRecord || selectedRecord).tasks, task => task.wkid === wkid);
                                                console.log("indexOfTaskToBeUpdated: ", indexOfTaskToBeUpdated);
                                                if (indexOfTaskToBeUpdated !== -1) {
                                                    const newRecord = { ...(updatedRecord || selectedRecord) };
                                                    newRecord.tasks = newRecord.tasks.map((task, index) =>
                                                        index === indexOfTaskToBeUpdated
                                                            ? { ...task, status: task.status === 1 ? 0 : 1 }
                                                            : task
                                                    );
                                                    setUpdatedRecord(newRecord);
                                                }
                                            }}>
                                                <Checkbox.Item label={''} color='black' status={optionalTask?.status === 1 ? 'checked' : 'unchecked'} />
                                                <Text style={styles.responseText}>{optionalTask?.category}</Text>
                                            </View>
                                        )
                                    )}
                                </View>
                            </View>
                        )}
                        {!isNil(updatedRecord) && (<View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 25 }}>
                            <Button mode="outlined" textColor='white' buttonColor={'mediumseagreen'} onPress={() => getLocation()}>
                                Submit
                            </Button>
                        </View>)}
                    </ScrollView>
                </>
            ) : (
                <Text>Nothing to display.</Text>
            )
            }
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    qrCode: {
        fontSize: 18,
        color: 'mediumseagreen',
        marginBottom: 20,
    },
    responseContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: '100%',
        height: 'auto',
        flexDirection: 'column'
    },
    responseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    responseText: {
        fontSize: 16,
        color: '#333',

    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});

export default TaskReportScreen;
