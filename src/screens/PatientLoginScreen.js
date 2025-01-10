import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {patientLogin} from '../services/api';

const PatientLoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        try {
            const data = await patientLogin(email, password);
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('patient', JSON.stringify(data.patient));

            // Alert.alert('Success', `Welcome ${data.patient.name}`);
            navigation.navigate('WelcomeScreen');
        } catch(error) {
            Alert.alert('Login Failed', error.message);
        }     
    };

    return (
        <Container>
            <Title>ZoomInClinic Patient Login</Title>

            <LogoContainer>
                <LogoImage source={require('../assets/ClinicLogo.png')} />
            </LogoContainer>

            <DoctorContainer>
                <DoctorImage source={require('../assets/DoctorsImageLogo.png')} />
            </DoctorContainer>

            <Input
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <Input
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <LoginButton onPress={handleLogin}>
                <ButtonText>Login</ButtonText>
            </LoginButton>
        </Container>
    );
};

export default PatientLoginScreen;

// Styled components
const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: #f3f4f6;
`;

const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin-bottom: 30px;
`;

const LogoContainer = styled.View`
    width: 100%;
    margin: 0 auto;
`;

//margin-bottom: 20px;

const LogoImage = styled.Image`
    margin: 0 auto 50px auto;
    width: 100%;
    height: 40px;
`;

const DoctorContainer = styled.View`
    margin: 0 auto;
    width:100%
`;
//align-items: center;
const DoctorImage = styled.Image`
    width: 100%;
    height: 200px;
    margin: 0 auto;
`;

const Input = styled.TextInput`
    width: 100%;
    height: 50px;
    border-color: #ddd;
    border-width: 1px;
    border-radius: 8px;
    padding-horizontal: 15px;
    font-size: 16px;
    margin-vertical: 10px;
    background-color: #fff;
`;

const LoginButton = styled.TouchableOpacity`
    background-color: #009688;
    padding-vertical: 15px;
    padding-horizontal: 50px;
    border-radius: 8px;
    align-items: center;
    margin-top: 25px;
`;

const ButtonText = styled.Text`
    color: #fff;
    font-size: 18px;
    font-weight: bold;
`;
