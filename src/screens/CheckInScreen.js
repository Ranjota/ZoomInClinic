import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { checkInNow } from '../services/api';

export default function CheckInScreen({ navigation }) {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCheckIn = async () => {
        if (reason.trim() === '') {
            Alert.alert('Please enter the reason for your visit');
            return;
        }

        setLoading(true); // Start loading indicator
        try {
            const response = await checkInNow(reason);
            setLoading(false); 

            if (response?.success) {
                // Alert.alert("You have successfully checked in!");
                Alert.alert(response.message, 'You have been added to the waiting queue.');
                navigation.navigate('WaitingRoomScreen', {
                    data: response.data
                }); // Navigate to Waiting Room
            } else if(response?.activeCheckIn) {
                navigation.navigate('WaitingRoomScreen', {
                    data: response.activeCheckIn.data
                }); // Navigate to Waiting Room
            }
            else {
                Alert.alert("Error checking in, please try again");
            }
        } catch (error) {
            setLoading(false);
            Alert.alert("Error", "Could not complete check-in. Please try again later.");
        }
    };

    return (
        <Container>
            <Header>
                <BackButton onPress={() => navigation.goBack()}>
                    <BackText>{"←"}</BackText>
                </BackButton>
                <Title>Check In</Title>
            </Header>
            
            <Content>
                <CheckInImage source={require('../assets/CheckInLogo.png')} />
                <InstructionContainer>
                    <InputContainer>
                        <Instruction>Tell us the reason for your visit</Instruction>
                        <ReasonInput 
                            placeholder='Describe your symptoms or reason for visit'
                            placeholderTextColor='#999'
                            value={reason}
                            onChangeText={setReason}
                            multiline
                        />
                         <CheckInButton onPress={handleCheckIn}>
                <ButtonText>Check In</ButtonText>
            </CheckInButton>
                    </InputContainer>
                </InstructionContainer>  
            </Content>

           
        </Container>
    );
};

const Container = styled.View`
    flex: 1;
    padding: 20px;
    background-color: #ffffff;
`;

const Header = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
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
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin:0 auto;
`;

const Content = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`;

const CheckInImage = styled.Image`
    width: 160px;
    height: 370px;   
    margin-left: 20px; 
`;
//resize-mode: contain;
// margin-right: 20px;

const InstructionContainer = styled.View`
    flex-direction: row;
`;

const InputContainer = styled.View`
    flex: 1;
    flex-direction: column;
`;
    //  padding: 10px;

const Instruction = styled.Text`
    font-size: 18px;
    color: #333;
    margin-bottom: 10px;
    width: 78%;
    font-weight:bold;
`;

const ReasonInput = styled.TextInput`
    height: 130px;
    width: 76%;
    font-size: 18px;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align-vertical: top;
    padding-top: 8px;
    padding-left:8px;
`;

const CheckInButton = styled.TouchableOpacity`
    background-color: #333;
    padding: 15px;
    border-radius: 8px;
    align-items: center;
    margin-top: 20px;
    width: 76%;
`;

const ButtonText = styled.Text`
    color: #ffffff;
    font-size: 18px;
    font-weight: bold;
`;
