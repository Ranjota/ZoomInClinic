import React from 'react';
import {GlobalStateProvider} from './src/context/GlobalStateContext';
import MainComponent from './MainComponent';
import {View, Text, Button} from 'react-native';
import { enableScreens } from 'react-native-screens';

enableScreens();


const App = () => {
    return (
        <GlobalStateProvider>
            <MainComponent />
        </GlobalStateProvider>
    )
}

export default App;