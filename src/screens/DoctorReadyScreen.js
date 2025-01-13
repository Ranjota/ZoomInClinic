import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { onAccept } from '../services/api';
import styled from 'styled-components/native';

export default function DoctorReadyScreen({ navigation, route }) {
    const [timer, setTimer] = useState(48);
    // const [timerActive, setTimerActive] = useState(false);
    const doctorDetails = useRef(route?.params?.data?.doctor);

    useEffect(() => {
        let timerInterval;

        // const fetchDoctorDetail 

            timerInterval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerInterval);
                        return 0;
                    }

                    return prev - 1;
                });
            }, 1000);
        

        return () => clearInterval(timerInterval);
    }, []);

    const handleAccept = async () => {
        try {
            const response = await onAccept();

            if (response) {
                Alert.alert('Session Started', 'You are now in consultation with the doctor!');
                // Navigate to the consultation screen or update UI
                navigation.navigate('VideoCallScreen'); // Assuming the next screen is 'ConsultationScreen'
            }
        } catch (error) {
            console.error('Error starting session:', error.response.data.message);
            Alert.alert('Error', 'There was an issue starting the session. Please try again.');
        }
    };

    const handleWait = () => {
        // onWait();
    }

    return (
        <Container>
            <Header>
                <BackButton onPress={() => navigation.goBack()}>
                    <BackText>&larr;</BackText>
                </BackButton>
                <Title>A doctor is ready to see you</Title>
            </Header>

            <DoctorInfoContainer>
                <DoctorImage source={{ uri: doctorDetails?.current.photoUrl }} />
                <DoctorName>{doctorDetails?.current.name}</DoctorName>
                <DoctorSpecialty>{doctorDetails?.current.specialty}</DoctorSpecialty>
                <DoctorDetails>
                    <Ribbon>
                        <RibbonIcon source={require('../assets/PatientNumberLogo.png')} />
                        <RibbonText>1000+</RibbonText>
                        <RibbonCaption>Patients</RibbonCaption>
                    </Ribbon>
                    <Ribbon>
                        <RibbonIcon source={require('../assets/DoctorExperienceLogo.png')} />
                        <RibbonText>{doctorDetails?.current.experience} Yrs</RibbonText>
                        <RibbonCaption>Experience</RibbonCaption>
                    </Ribbon>
                    <Ribbon>
                        <RibbonIcon source={require('../assets/DoctorRatingLogo.png')} />
                        <RibbonText>{doctorDetails?.current.rating}</RibbonText>
                        <RibbonCaption>Rating</RibbonCaption>
                    </Ribbon>
                </DoctorDetails>
                <DoctorBioContainer>
                    <DoctorBioTitle>About this doctor</DoctorBioTitle>
                    <DoctorBio>{doctorDetails.current.bio}</DoctorBio>
                </DoctorBioContainer>
            </DoctorInfoContainer>

            <ActionButtonsContainer>
                <WaitButton onPress={handleWait}>
                    <WaitButtonText>Wait for another doctor</WaitButtonText>
                </WaitButton>

                <AcceptButton onPress={handleAccept} disabled={timer === 0}>
                    <AcceptButtonText>Accept ({timer}s)</AcceptButtonText>
                </AcceptButton>
            </ActionButtonsContainer>
        </Container>
    )
};

const Container = styled.View`
    flex: 1;
    padding: 20px;
    background-color:#F8F8F8;
`;

const Header = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
`;

const BackButton = styled.TouchableOpacity`
    display: flex;
    align-items: center;
    justify-content: center; /* Center content vertically */
    border-width: 1px;
    border-color: silver;
    border-radius: 5px;
    width: 40px;
    height: 40px;
    margin: 0;
    padding: 0;
`;

const BackText = styled.Text`
    font-size: 28px;
    color: #58656D;
    font-weight: bold;
    text-align: center;
    line-height: 28px;
    margin: 0 auto;
    padding: 0;
`;

const Title = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin: 0 auto;
`;

const DoctorInfoContainer = styled.View`
    align-items: center;
    margin-bottom: 8px;
    border-radius:50%;
    border-color: silver;
`;

const DoctorImage = styled.Image`
    width: 120px;
    height: 120px;
    border-radius: 75px;
    margin-bottom: 15px;
`;

const DoctorName = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #263138;
`;

const DoctorSpecialty = styled.Text`
    font-size: 18px;
    color: #555;
    margin-bottom: 10px;
`;

const DoctorDetails = styled.View`
    flex-direction:row;
    flex-grow:1;
    margin-bottom: 15px;
`;

const Ribbon = styled.View`
    background-color: white;
    padding: 0px;
    margin-right: 5px;
    border-radius: 10px;
    flex-grow: 1;
    align-items: center;
    flex-direction: column;
    min-height:90px;
    height: auto;
    width:100px;
`;

const RibbonIcon = styled.Image`
    width: 55px;
    height: 58px;
    margin-bottom:5px;
`;

const RibbonText = styled.Text`
    font-size: 15px;
    color: #263138;
    font-weight: bold;
    align-items: center;
`;

const RibbonCaption = styled.Text`
    font-size: 14px;
    color: #6A769A;
    font-weight: bold;
    align-items: center;
    margin-bottom:5px;
`;

const DoctorBioContainer = styled.View`
    padding: 2px;
    align-items:left;
    margin:5px 0px 5px 0px;
`;

const DoctorBioTitle = styled.Text`
    color:black;
    font-size: 19px;
    font-weight: bold;
    text-align: left;
    margin-bottom:3px;
`;

const DoctorBio = styled.Text`
    font-size: 16px;
    color: #737EA0;
    text-align: left;
`;

const CountdownText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    margin-top: 20px;
    text-align: center;
`;

const ActionButtonsContainer = styled.View`
    margin-top:5px;
    align-items: center;
`;

const WaitButton = styled.TouchableOpacity`
    background-color: #ffffff;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 12px;
    width: 100%;
    align-items: center;
`;

const AcceptButton = styled.TouchableOpacity`
    background-color: #263138;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
    width: 100%;
    align-items: center;
`;

const WaitButtonText = styled.Text`
    font-size: 16px;
    color: black;
    font-weight: bold;
`;

const AcceptButtonText = styled.Text`
    font-size: 16px;
    color: white;
    font-weight: bold;
`;
