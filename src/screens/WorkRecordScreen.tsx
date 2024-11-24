import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const WorkRecordScreen = () => {
    const [locationType, setLocationType] = useState('Type 1');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [results, setResults] = useState([]);

    // Dummy data for search results
    const mockData = [
        { id: '1', task: 'Task 1', location: 'Location 1', status: 'Pending', time: '8:00 AM' },
        { id: '2', task: 'Task 2', location: 'Location 5', status: 'Complete', time: '9:00 AM' },
        { id: '3', task: 'Task 3', location: 'Location 3', status: 'Scheduled', time: '10:00 AM' },
    ];

    const handleSearch = () => {
        // For now, just simulate returning all data
        setResults(mockData);
        Alert.alert('Search Complete', 'Showing filtered results.');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Work Record</Text>

            {/* Search Criteria Section */}
            <View style={styles.searchCriteria}>
                <Text style={styles.sectionTitle}>Search Criteria</Text>

                <View style={styles.row}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Location Type</Text>
                        <Picker
                            selectedValue={locationType}
                            onValueChange={(itemValue) => setLocationType(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Type 1" value="Type 1" />
                            <Picker.Item label="Type 2" value="Type 2" />
                            <Picker.Item label="Type 3" value="Type 3" />
                        </Picker>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter location"
                            value={location}
                            onChangeText={(text) => setLocation(text)}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Start Date</Text>
                        <TouchableOpacity
                            style={styles.datePicker}
                            onPress={() => setShowStartDatePicker(true)}
                        >
                            <Text>{startDate.toDateString()}</Text>
                        </TouchableOpacity>
                        {showStartDatePicker && (
                            <DateTimePicker
                                value={startDate}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowStartDatePicker(false);
                                    if (selectedDate) setStartDate(selectedDate);
                                }}
                            />
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>End Date</Text>
                        <TouchableOpacity
                            style={styles.datePicker}
                            onPress={() => setShowEndDatePicker(true)}
                        >
                            <Text>{endDate.toDateString()}</Text>
                        </TouchableOpacity>
                        {showEndDatePicker && (
                            <DateTimePicker
                                value={endDate}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowEndDatePicker(false);
                                    if (selectedDate) setEndDate(selectedDate);
                                }}
                            />
                        )}
                    </View>
                </View>

                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>

            {/* Results Section */}
            <Text style={styles.sectionTitle}>Result</Text>
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.resultItem}>
                        <Text style={styles.resultText}>
                            <Text style={styles.resultBold}>{item.task}</Text> {' '}
                            {item.location} {' '}
                            <Text style={[
                                styles.status,
                                item.status === 'Pending' ? styles.pending :
                                    item.status === 'Complete' ? styles.complete : styles.scheduled
                            ]}>
                                {item.status}
                            </Text> {' '}
                            Start Time: {item.time}
                        </Text>
                    </View>
                )}
            />
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
    },
    searchCriteria: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 15,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    inputContainer: {
        flex: 1,
        marginRight: 10,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    picker: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    datePicker: {
        height: 40,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
    },
    searchButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    resultItem: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    resultText: {
        fontSize: 16,
    },
    resultBold: {
        fontWeight: 'bold',
    },
    status: {
        fontWeight: 'bold',
    },
    pending: {
        color: 'red',
    },
    complete: {
        color: 'green',
    },
    scheduled: {
        color: 'orange',
    },
});

export default WorkRecordScreen;
