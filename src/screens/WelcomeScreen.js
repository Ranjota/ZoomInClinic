import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { fetchStats, subscribeToLiveStats } from '../services/api';
import styled from 'styled-components/native';
import { StyledButton } from '../components/StyledButton';
import { useKeepAwake } from 'expo-keep-awake';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen({ navigation }) {
  const [patientName, setPatientName] = useState('');
  const [stats, setStats] = useState({
    totalDoctorsOnline: 0,
    totalPatients: 0,
    averageWaitTime: 'Loading...'
  });
  useKeepAwake();

  useEffect(() => {
      let eventSource;
      const loadPatientData = async () => {
        const storedPatient = await AsyncStorage.getItem('patient');
        if(storedPatient) {
          setPatientName(JSON.parse(storedPatient).name);
        }
      }
      loadPatientData();

      const loadInitialStats = async () => {
          try {
              const data = await fetchStats();
              setStats(data);
          } catch(error) {
              console.log('Failed to fetch stats:', error);
          }
      };

      loadInitialStats();

      const initializeLiveUpdates = async () => {
        try {
          
          eventSource = subscribeToLiveStats((liveData) => {
              setStats(liveData.stats);
          });

        
          // Add an error listener
        eventSource.onerror = (error) => {          
            console.error('Error with EventSource:', error);
        };

        } catch (error) {    
          console.error('Failed to initialize live updates:', error);
        }
      }

    initializeLiveUpdates();

    return () => {
        if (eventSource) {
          // eventSource.close();
        }
    }
  },[]);

  return (
    <Container>
        <Heading>Welcome, {patientName}</Heading>
        <Logo source={require('../assets/ClinicLogo.png')} />
        <Subheading>Your local Zoom-In Clinic</Subheading>
        <DoctorsImage source={require('../assets/DoctorsImageLogo.png')} />
      <ButtonContainer>
        <StyledButton title='Check in now' onPress={() => navigation.navigate('CheckInScreen')} />
        <StyledButton title='See our doctors' onPress={() => navigation.navigate('DoctorListScreen')} />
        <StyledButton title='Your medical profile' onPress={() => { }} />
      </ButtonContainer>
      <StatsContainer>
        <Stat>Doctors online: {stats.totalDoctorsOnline}</Stat>
        <Stat>Patients online: {stats.totalPatients}</Stat>
        <Stat>Estimated waiting time: {stats.averageWaitTime}</Stat>
      </StatsContainer>
    </Container>
  )
};

const Container = styled.View`
    flex:1;
    justify-content: center;
    align-items:center;
    background-color: #EBF7FE;
    padding:5px;
    position: relative;
`;

const Heading = styled.Text`
    font-size:15px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    position: absolute;
    top: 10px;
    left: 10px;
`;

const Logo = styled.Image`
    width: 300px; 
    height: 50px;
    margin: 2% auto 0 auto;
`;

const DoctorsImage = styled.Image`
    width: 300px; 
    height: 200px; 
`;

const Subheading = styled.Text`
    font-size: 20px;
    color: #555;
    margin: 10px auto 20px auto;
`;

const ButtonContainer = styled.View`
    margin-bottom: 20px;
`;

// const StyledButton = styled(Button)`
//     margin-vertical: 10px;
// `;

const StatsContainer = styled.View`
    margin-top: 20px;
    position: absolute;
    bottom: 10px;
    left: 10px;
`;

const Stat = styled.Text`
    font-size: 16px;
    color: #444;
`;

