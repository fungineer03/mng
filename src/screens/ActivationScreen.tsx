import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text } from 'react-native';
import { Button } from 'react-native-paper';
import isNumber from 'lodash/isNumber';
import isEmpty from 'lodash/isEmpty';

import { STATUS_SUCCESS } from '../utils/constants';
import { getActivationKey } from '../services/apiService';
import { useAppContext } from '../context/AppContext';

const ActivationScreen = () => {
    const [key, setKey] = useState('');
    const { dispatch } = useAppContext();

    const handleActivate = async () => {
        if (isEmpty(key)) {
            Alert.alert('Error', `Please enter Activation Key`);
        } else {
            try {
                const { result, name, token, message } = await getActivationKey(key);
                dispatch({ type: 'SET_ACTIVATION_DATA', payload: { token: "0388dee36b68d6d485c8b7ac8e417ccb", name: 'Faisal' } });
                // TODO Replace actual token with token string
                // if (isNumber(result) && result === STATUS_SUCCESS) {
                //     dispatch({ type: 'SET_ACTIVATION_DATA', payload: { token, name } });
                //     Alert.alert('Success', `Activation Successful: ${message}`);
                // } else {
                //     Alert.alert('Error', `Activation Unsuccessful: ${message}`);
                // }
            } catch (error: any) {
                Alert.alert('Error', error.message);
            }
        }

    };

    return (
        <View style={styles.container}>
            <Text>
                Please Enter Activation Key
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Activation Key"
                value={key}
                onChangeText={setKey}
            />
            <View style={styles.buttonContainer}>
                <Button mode="outlined" textColor='white' buttonColor={'mediumseagreen'} onPress={handleActivate}>
                    Activate
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 20,
    },
    buttonContainer: {
        width: '50%',
    },
});

export default ActivationScreen;
