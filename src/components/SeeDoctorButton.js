import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Alert } from 'react-native';

const SeeDoctorButton = ({ waitingRoomData, handleSeeDoctorNow }) => {
    const [timer, setTimer] = useState(60);
    const [timerActive, setTimerActive] = useState(true);
    const [buttonVisible, setButtonVisible] = useState(true);

    useEffect(() => {
        let timerInterval;

        // Start the timer only when the button becomes visible
        if (buttonVisible && !timerActive) {
            setTimerActive(true); // Start the timer when button becomes visible
        }

        timerInterval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(timerInterval);
                        setButtonVisible(false);
                        setTimerActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        
    }, []);

    const handlePress = () => {
        handleSeeDoctorNow();
    }


    return (
        buttonVisible && (
            <SeeDoctorButtonContainer onPress={handlePress}>
                <SeeDoctorButtonText>
                    {timerActive ?  `See a Doctor Now (${timer}s)`: `Accepting call in ${timer}s`}
                </SeeDoctorButtonText>
            </SeeDoctorButtonContainer>
        )
    );
};

const SeeDoctorButtonContainer = styled.TouchableOpacity`
    background-color: #263138;
    padding: 15px;
    border-radius: 10px;
    align-items: center;
    margin-top: 18px;
`;

const SeeDoctorButtonText = styled.Text`
    font-size: 16px;
    color: white;
    font-weight: bold;
`;

export default SeeDoctorButton;
