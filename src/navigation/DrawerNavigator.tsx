import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import isNil from 'lodash/isNil';

import HomeScreen from '../screens/HomeScreen';
import ActivationScreen from '../screens/ActivationScreen';
import WorkRecordScreen from '../screens/WorkRecordScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ScanQRCodeScreen from '../screens/ScanQRCodeScreen';
import TaskReportScreen from '../screens/TaskReportScreen';
import { useAppContext } from '../context/AppContext';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    const { state } = useAppContext();
    return (
        <NavigationContainer>
            <Drawer.Navigator
                initialRouteName="Activate"
                screenOptions={{
                    drawerStyle: {
                        backgroundColor: '#fff',
                        width: 240,
                    },
                    headerShown: true, // Optional: Show header for each screen
                }}
            >
                {isNil(state.userToken) && <Drawer.Screen name="Activate" component={ActivationScreen} />}
                {!isNil(state.userToken) && (
                    <>
                        <Drawer.Screen name="Home" component={HomeScreen} />
                        <Drawer.Screen name="Profile" component={ProfileScreen} />
                        <Drawer.Screen name="Scan QR Code" component={ScanQRCodeScreen} />
                        <Drawer.Screen
                            name="Task Report Screen" // Add this screen
                            component={TaskReportScreen}
                            options={{
                                drawerItemStyle: { display: 'none' }, // Hide from drawer
                                headerShown: true, // Optional: Show header if needed
                            }}
                        />
                    </>
                )}
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default DrawerNavigator;