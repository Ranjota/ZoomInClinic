import React from 'react';
import styled from 'styled-components/native';
import { Text } from 'react-native';


export const StyledButton = ({ title, onPress }) => {
    return (
        <ButtonContainer onPress={onPress}>
            <ButtonText>{title}</ButtonText>
        </ButtonContainer>
    )
};

const ButtonContainer = styled.TouchableOpacity`
    background-color: #263238;
    padding: 10px 20px;
    border-radius: 20px;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    width: 300px;
    height: 60px;
`;

const ButtonText = styled.Text`
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
`;