import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen.js';
import DoctorListScreen from '../screens/DoctorListScreen.js';
import CheckInScreen from '../screens/CheckInScreen.js';
import DoctorReadyScreen from '../screens/DoctorReadyScreen.js';
import WaitingRoomScreen from '../screens/WaitingRoomScreen.js';
import VideoCallScreen from '../screens/VideoCallScreen.js';

const Stack = createNativeStackNavigator();

const MainComponent = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen name='Welcome' component={WelcomeScreen} />
                <Stack.Screen name='DoctorList' component={DoctorListScreen}/>
                <Stack.Screen name='CheckIn' component={CheckInScreen} />
                <Stack.Screen name='WaitingRoom' component={WaitingRoomScreen}/>
                <Stack.Screen name='DoctorReady' component={DoctorReadyScreen} />
                <Stack.Screen name='VideoCall' component={VideoCallScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default MainComponent;