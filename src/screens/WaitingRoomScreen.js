import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, Alert, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import SeeDoctorButton from '../components/SeeDoctorButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWaitingRoomData, proceedWithCancellation, subscribeToLiveStats, getAvailableDoctor } from '../services/api'; // Added initiateDoctorSession
import Dialog from 'react-native-dialog';

export default function WaitingRoomScreen({ navigation, route }) {
    const [waitingRoomData, setWaitingRoomData] = useState(
        route.params?.data?.activeCheckIn ||  route.params?.data?.data || {
            waitTimeSoFar: '0h 0m 0s',
            estimatedWaitTime: 0,
            positionInQueue: 0,
            totalDoctorsOnline: 0,
            totalPatientsPending: 0,
            reasonForVisit: '',
            averageWaitTimePerPatient: 0,
            checkInTime: null, // Use null to signify no check-in time
        }
    );

    const checkInTimeRef = useRef(route.params?.data?.activeCheckIn?.checkInTime || 0);
    const [waitTimeSoFar, setWaitTimeSoFar] = useState(route.params?.data?.activeCheckIn?.waitTimeSoFar || 0);
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [cancellationReason, setCancellationReason] = useState('');

    const calculateWaitTimeSoFar = () => {
        if (route.params?.data || checkInTimeRef.current) {
            const currentTime = new Date();
            const checkInTime =
                route.params?.data?.checkInTime
                    ? new Date(route.params.data.checkInTime)
                    : checkInTimeRef.current
                    ? new Date(checkInTimeRef.current)
                    : null;

            if (!checkInTime) {
                return `${0}h ${0}m ${0}s`;
            }

            const elapsedTimeInSeconds = (currentTime - checkInTime) / 1000; // Time elapsed in seconds

            const hours = Math.floor(elapsedTimeInSeconds / 3600); // Get full hours
            const minutes = Math.floor((elapsedTimeInSeconds % 3600) / 60); // Get remaining minutes
            const seconds = Math.floor(elapsedTimeInSeconds % 60); // Get remaining seconds

            return `${hours}h ${minutes}m ${seconds}s`;
        }

        return `${0}h ${0}m ${0}s`;
    };

    const formatValue = (value, fallback = '--') => (value !== null && value !== undefined ? value : fallback);

    useEffect(() => {
        if (!route.params?.data?.activeCheckIn) {
            const loadWaitingRoomData = async () => {
                try {
                    const data = await fetchWaitingRoomData();
                    setWaitingRoomData(data);
                    checkInTimeRef.current = data.checkInTime;
                } catch (error) {
                    console.log(error);
                    console.error('Error fetching waiting room waitingRoomData?:', error);
                    Alert.alert('Error', 'Failed to load waiting room waitingRoomData?. Please try again.');
                } finally {
                    setLoading(false);
                }
            };
            loadWaitingRoomData();
        }

        const eventSource = subscribeToLiveStats((liveData) => {
            // prevData contains the current state of the waiting room data that is already displayed on the screen.
            // When new data (liveData) arrives, it might not include all the fields in the prevData.
            // Example: liveData might only include updates for queuePosition and estimatedTimeRemaining, but other fields like reasonForVisit or waitTimeSoFar might remain unchanged.
            // By spreading prevData into the new state, we ensure that any unchanged fields remain intact.
            setWaitingRoomData((prevData) => ({
                ...prevData,
                ...liveData.waitingRoom,
            }));
        });

        // Cleanup subscription on component unmount
        return () => {
            // if (eventSource) eventSource.close();
        };
    }, []);

    useEffect(() => {
        const waitTimeInterval = setInterval(() => {
            const calculatedWaitTime = calculateWaitTimeSoFar(); // Calculate wait time dynamically
            setWaitTimeSoFar(calculatedWaitTime); // Update state when wait time changes
        }, 1000); // Update every second

        // Cleanup the interval on component unmount
        return () => clearInterval(waitTimeInterval);
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    const handleCancelAppointment = async (event) => {
        event.persist();

        if (!dialogVisible) {
            const userConfirmed = await new Promise((resolve) => {
                Alert.alert('Cancel Appointment', 'Do you want to cancel your current appointment', [
                    { text: 'No', style: 'cancel', onPress: () => resolve(false) },
                    { text: 'Yes', onPress: () => resolve(true) },
                ]);
            });

            if (userConfirmed) {
                setDialogVisible(true);
            }
        }
    };

    const handleSubmitCancellation = async (event) => {
        try {
            event.persist();
            setLoading(true);
            await proceedWithCancellation('', cancellationReason || 'No Reason Provided');
            Alert.alert('Appointment Canceled', 'Your appointment has been successfully canceled.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'There was an issue canceling your appointment. Please try again.');
        } finally {
            setLoading(false);
            setDialogVisible(false);
        }
    };

    const handleSeeDoctorNow = async () => {
        const storedPatient = await AsyncStorage.getItem('patient');
        const patientId = JSON.parse(storedPatient).id;
        const doctor = await getAvailableDoctor(patientId);
        navigation.navigate('DoctorReadyScreen', {
            doctor: doctor
        });
        // setLoading(true);

        // try {
        //     const result = await initiateDoctorSession(); // Assuming this API triggers the doctor session
        //     if (result.success) {
        //         Alert.alert('Session Started', 'You are now seeing a doctor!');
        //         // Navigate or handle the result as necessary
        //         navigation.navigate('DoctorSessionScreen'); // Assuming there's a screen for the doctor session
        //     } else {
        //         Alert.alert('Error', 'Failed to initiate the doctor session. Please try again later.');
        //     }
        // } catch (error) {
        //     Alert.alert('Error', 'There was an issue starting your session. Please try again.');
        // } finally {
        //     setLoading(false);
        // }
    };

    if (loading) {
        return (
            <LoadingContainer>
                <ActivityIndicator size='large' color='#009688' />
            </LoadingContainer>
        );
    }

    if (!waitingRoomData) {
        return (
            <ErrorContainer>
                <ErrorMessage>Failed to load waiting room waitingRoomData?. Please try again.</ErrorMessage>
            </ErrorContainer>
        );
    }

    return (
        <Container>
            <Header>
                <BackButton onPress={() => navigation.goBack()}>
                    <BackText>&larr;</BackText>
                </BackButton>
                <Title>Waiting Room</Title>
            </Header>

            <Illustration>
                <IllustrationImage source={require('../assets/WaitingRoomWaitingLogo.png')} />
            </Illustration>

            <DetailsContainer>
                <DetailRow>
                    <DetailLabel>Wait time so far</DetailLabel>
                    <DetailValue>{formatValue(waitTimeSoFar, waitingRoomData?.waitTimeSoFar)}</DetailValue>
                </DetailRow>
                <DetailRow>
                    <DetailLabel>Est. time remaining</DetailLabel>
                    <DetailValue>{waitingRoomData?.estimatedWaitTime || '--'}</DetailValue>
                </DetailRow>
                <DetailRow>
                    <DetailLabel>Position in queue</DetailLabel>
                    <DetailValue>{(waitingRoomData?.positionInQueue + '/' + waitingRoomData?.totalPatientsPending) || '--'}</DetailValue>
                </DetailRow>
                <DetailRow>
                    <DetailLabel>Total doctors online</DetailLabel>
                    <DetailValue>{waitingRoomData?.totalDoctorsOnline || '--'}</DetailValue>
                </DetailRow>
                <ReasonForVisit>
                    <DetailLabel>Reason for visit:</DetailLabel>
                    <ReasonText>{waitingRoomData?.reasonForVisit || 'No reason provided'}</ReasonText>
                </ReasonForVisit>
            </DetailsContainer>

            <CancelButton onPress={handleCancelAppointment}>
                <CancelButtonText>Cancel my appointment</CancelButtonText>
            </CancelButton>

            {waitingRoomData?.positionInQueue == 1 && waitingRoomData?.estimatedWaitTime == '0 minutes' &&
                <SeeDoctorButton 
                    waitingRoomData={waitingRoomData} 
                    handleSeeDoctorNow={handleSeeDoctorNow}/>
            }

            <Dialog.Container visible={dialogVisible}>
                <Dialog.Title>Cancel Appointment</Dialog.Title>
                <Dialog.Description>Please provide a reason for cancellation (optional).</Dialog.Description>
                <Dialog.Input
                    placeholder='Enter reason'
                    value={cancellationReason}
                    onChangeText={(text) => {
                        setCancellationReason(text); // Update the state
                    }}
                />
                <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
                <Dialog.Button label="Submit" onPress={handleSubmitCancellation} />
            </Dialog.Container>
        </Container>
    );
}

const Container = styled.View`
    flex: 1;
    background-color: #ffffff;
    padding: 20px;
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

const Illustration = styled.View`
    width: 100%;
    height: 180px;
    margin: 0 auto 20px auto;
    resize-mode: contain;
`;

const IllustrationImage = styled.Image`
    width: 300px;
    height: 180px;
    margin-bottom: 100px;
`;

const DetailsContainer = styled.View`
    padding: 15px;
    margin-bottom: 20px;
`;

const DetailRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 7px;
    margin-bottom: 13px;
    border-bottom-width: 1px;
    border-bottom-color: silver;
`;

const DetailLabel = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: black;
`;

const DetailValue = styled.Text`
    font-size: 16px;
    color: #333;
`;

const ReasonForVisit = styled.View`
    margin-top: 2px;
`;

const ReasonText = styled.Text`
    font-size: 16px;
    color: #555;
    margin-top: 5px;
`;

const CancelButton = styled.TouchableOpacity`
    background-color: #ffffff;
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #ccc;
    align-items: center;
`;

const CancelButtonText = styled.Text`
    font-size: 16px;
    color: #ff3b30;
    font-weight: bold;
`;

const LoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const ErrorContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const ErrorMessage = styled.Text`
    font-size: 18px;
    color: #ff0000;
    text-align: center;
    margin-top: 20px;
`;
