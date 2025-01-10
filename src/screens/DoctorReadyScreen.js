import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import styled from 'styled-components/native';

export default function DoctorReadyScreen({navigation, doctor}) {
    const [timer, setTimer] = useState(48);
    const [timerActive, setTimerActive] = useState(false);
    const [doctorDetails, setDoctorDetails] = useState(doctor);

    useEffect(() => {
        let timerInterval;

        // const fetchDoctorDetail 

        if(timerActive) {
            timerInterval = setInterval(() => {
                setTimer((prev) => {
                    if(prev <= 1) {
                        clearInterval(timerInterval);
                        return 0;
                    }

                    return prev-1;
                });
            }, 1000);
        }

        return () => clearInterval(timerInterval);
    }, [timerActive]);

    const handleAccept = () => {
        onAccept();
        setTimerActive(false);
    }

    const handleWait = () => {
        onWait();
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
                <DoctorImage source={require('../assets/CheckInLogo.png')}/>
                <DoctorName>Doctor Name</DoctorName>
                <DoctorSpecialty>Doctor Specialty</DoctorSpecialty>
                <DoctorDetails>
                    <DetailItem>
                        <Text>1000+ patients</Text>
                    </DetailItem>
                    <DetailItem>
                        <Text>Doctor experience</Text>
                    </DetailItem>
                    <DetailItem>
                        <Text>Doctor rating</Text>
                    </DetailItem>
                </DoctorDetails>

                <DoctorBio>Doctor bio</DoctorBio>
            </DoctorInfoContainer>
        </Container>
    )
};

const Container = styled.View`
    flex: 1;
    padding: 20px;
    background-color: #fff;
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
    margin-bottom: 30px;
    border-radius:50%;
    border-color: silver;
`;

const DoctorImage = styled.Image`
    width: 150px;
    height: 150px;
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
    flex-direction: row;
    margin-bottom: 15px;
`;

const DetailItem = styled.View`
    margin-right: 15px;
`;

const DoctorBio = styled.Text`
    font-size: 14px;
    color: #777;
    text-align: center;
`;

const CountdownText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    margin-top: 20px;
    text-align: center;
`;

const ActionButtonsContainer = styled.View`
    margin-top: 30px;
    align-items: center;
`;

const ActionButton = styled.TouchableOpacity`
    background-color: #263138;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
    width: 100%;
    align-items: center;
`;

const ActionButtonText = styled.Text`
    font-size: 16px;
    color: white;
    font-weight: bold;
`;
