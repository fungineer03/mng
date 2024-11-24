import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ActivationScreen from '../screens/ActivationScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Activate">
                <Stack.Screen name="Activate" component={ActivationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;