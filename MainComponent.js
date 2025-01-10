import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import PatientLoginScreen from './src/screens/PatientLoginScreen';
import DoctorListScreen from './src/screens/DoctorListScreen';
import CheckInScreen from './src/screens/CheckInScreen';
import WaitingRoomScreen from './src/screens/WaitingRoomScreen';
import DoctorReadyScreen from './src/screens/DoctorReadyScreen';
// import WaitingRoomScreen from './src/screens/WaitingRoomScreen';
// import VideoCallScreen from './src/screens/VideoCallScreen';
// import {View, Text, Button} from 'react-native';
import {View, Text, Button} from 'react-native';
import { enableScreens } from 'react-native-screens';

enableScreens();

const Stack = createStackNavigator();


export default function MainComponent() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='PatientLoginScreen'>
                <Stack.Screen name='PatientLoginScreen' component={PatientLoginScreen} />
                <Stack.Screen name='WelcomeScreen' component={WelcomeScreen} />
                <Stack.Screen name='CheckInScreen' component={CheckInScreen} />
                <Stack.Screen name='DoctorListScreen' component={DoctorListScreen}/>
                <Stack.Screen name='WaitingRoomScreen' component={WaitingRoomScreen}/>
                <Stack.Screen name='DoctorReadyScreen' component={DoctorReadyScreen} />
                {/* <Stack.Screen name='VideoCall' component={VideoCallScreen}/>   */}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

