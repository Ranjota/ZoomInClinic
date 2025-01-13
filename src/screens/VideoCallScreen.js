import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Video } from 'twilio-video'; // Twilio Video library\
import {generateVideoToken} from '../services/api'
import styled from 'styled-components/native';

export default function VideoCallScreen({navigation}) {
    const [room, setRoom] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    useEffect(() => {
        connectToRoom();

        return () => {
            // Clean up on component unmount
            if (room) {
                room.disconnect();
            }
        };
    });

    const connectToRoom = async () => {
        try {
            const token = await generateVideoToken();
         
            const room = await Video.connect(token, {name: 'room-name'});

            setRoom(room);

            const localParticipant = room.localParticipant;
            const localTracks = localParticipant.tracks;
            const videoTrack = localTracks.get('video');
            
            setLocalStream(videoTrack);

            room.on('participantConnected', (participant) => {
                console.log('Participant connected:', participant.identity);

                participant.on('trackSubscribed', (track) => {
                    if(track.kind === 'video') {
                        setRemoteStream(track);
                    }
                });
            });

            room.on('disconnected', () => {
                console.log('Disconnected from the room');
                setRoom(null);
                setLocalStream(null);
                setRemoteStream(null);
            });

        } catch(error) {
            console.error('Error connecting to the room:', error);
            Alert.alert('Error', 'Unable to connect to the video call.');
        }
    };

    const endCall = () => {
        if(room) {
            room.disconnect();
            Alert.alert('Call Ended', 'You have successfully ended the call.');
        }
    };

    return (
        <Container>
             <Header>
                <BackButton onPress={() => navigation.goBack()}>
                    <BackText>&larr;</BackText>
                </BackButton>
                <Title>Waiting Room</Title>
            </Header>
            <VideoContainer>
                {
                    localStream && (
                        <VideoStreamContainer>
                            <Text>Local Stream</Text>
                            <VideoView  stream={localStream}/>
                        </VideoStreamContainer>
                    )
                }

                {
                    remoteStream && (
                        <VideoStreamContainer>
                            <Text>Remote Stream</Text>
                            <VideoView stream={remoteStream} />
                        </VideoStreamContainer>
                    )
                }
            </VideoContainer>

            <ActionButtonsContainer>
                <EndButton onPress={endCall}>
                    <EndButtonText>End Call</EndButtonText>
                </EndButton>
            </ActionButtonsContainer>
        </Container>
    )
};

const Container = styled.View`
    flex: 1;
    padding: 20px;
    background-color: #F8F8F8;
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
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin: 0 auto;
`;

const VideoContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const VideoStreamContainer = styled.View`
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    margin: 10px;
`;

const VideoView = styled.View`
    background-color: #000;
    width: 100%;
    height: 100%;
    border-radius: 10px;
`;

const ActionButtonsContainer = styled.View`
    margin-top: 20px;
    align-items: center;
`;

const EndButton = styled.TouchableOpacity`
    background-color: #FF3B30;
    padding: 15px;
    border-radius: 10px;
    width: 100%;
    align-items: center;
`;

const EndButtonText = styled.Text`
    font-size: 16px;
    color: white;
    font-weight: bold;
`;
