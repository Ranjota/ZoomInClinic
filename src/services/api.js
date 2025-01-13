import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import EventSource from 'react-native-event-source';
import { Alert } from 'react-native';
//import { EventSource } from 'react-native-sse';

const API_URL = 'https://zoominclinic-backend.onrender.com';

const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    return token ? `Bearer ${token}`: null;
}

// Fetch stats data from the REST API once
export const fetchStats = async () => {
    try {
        const token = await getToken();

        const response = await axios.get(`${API_URL}/api/stats/summary`, {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
};

// Subscribe to live stats updates using Server-Sent Events (SSE)
export const subscribeToLiveStats = async (onMessage) => {
    try{
        const token = await getToken();

        //Create a new EventSource connection to the SSE endpoint
        const eventSource = new EventSource(`${API_URL}/api/waiting-room/live`,  
            {
                headers: { 
                Authorization: token,
                Accept: 'text/event-stream', 
                withCredentials: false  
            }
        });
    
        eventSource.addEventListener('update', (event) => {
            const liveData = JSON.parse(event.data);
            onMessage(liveData);
        });
    
        // Return the EventSource instance so it can be closed by the caller when no longer needed
        return eventSource;
    } catch(error) {
        console.log(error);
    } 
};

export const patientLogin = async(email, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {email, password});
        return response.data;
    } catch(error) {
        console.error(error);
        throw new Error(error.response?.data?.message || 'Login failed');
    }
}

export const checkInNow = async(reason) => {
    try {
        const token = await getToken();
        const response = await axios.post(`${API_URL}/api/check-in`, {reason, cancelExisting: false}, {
            headers: {
                Authorization:token
            }
        });

        if(response.data.activeCheckIn) {
            const userConfirmed = await new Promise((resolve) => {
                Alert.alert(
                    'Existing Check-In Found',
                    'You already have a pending check-in. Do you want to cancel it and create a new one?',
                    [
                        {text: 'No', style: 'cancel', onPress: () => resolve(false)},
                        {text: 'Yes', onPress: () => resolve(true)}
                    ]
                )
            });
            

            if(userConfirmed) {
                const test = await proceedWithCancellation(reason);
                return test;
            }

            return response.data;
        }

        return response.data;
    } catch(error) {
        console.log(error);
        console.error('Error checking in:', error);
        throw error;
    }
}


export const proceedWithCancellation = async (reason, cancellationReason = '') => {
    try {
        const token = await getToken();
        const response = await axios.post(`${API_URL}/api/check-in`, {reason, cancelExisting: true, cancellationReason}, {
            headers: {
                Authorization:token
            }
        });
        return response.data;
    } catch(error) {
        console.error('Error during cancellation and check-in:', error);
    }
};

export const fetchDoctorsList = async(query='', page = 1, filters, limit=10) => {
    try {
        const token = await getToken();
        const { doctorSpecialty, minRating, doctorAvailability } = filters;

        const response = await axios.get(`${API_URL}/api/doctorList`, {
            params: { 
            query,
            limit,
            page,
            doctorSpecialty,
            minRating,
            doctorAvailability: doctorAvailability ? true: ''
        },
            headers: {
                Authorization: token
            }
        });   
        
        return response.data;
    } catch(error) {
        console.error('Error fetching doctors:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch doctors. Please try again.');
    }  
}

export const getAvailableDoctor = async() => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/api/sessions/assign-doctor-by-patient`, {
            headers: {
                Authorization:token
            }
        });

        return response.data;
    } catch(error) {
        if (error.response) {
            // If there's a response with a non-2xx status code
            if (error.response.status === 409) {
                Alert.alert(error.response.data.message); // Display the message
                // You can show the message in the UI or alert
            } else {
                console.log('Other error:', error.response.data.message);
            }
        } else {
            console.log('Error with the request:', error.message);
        }
    }
}

export const fetchWaitingRoomData = async() => {
    try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/api/waiting-room`, {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    } catch(error) {
        console.error('Error fetching waiting room data:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch waiting room data.');
    }
};

export const subscribeToWaitingRoomUpdates = async (onMessage) => {
    try {
        const token = await getToken();
        const eventSource = new EventSource(`${API_URL}/api/waiting-room/live?token=${token}`, {
            headers: {
                Accept: 'text/event-stream',
                withCredentials: false
            }
        });

        eventSource.addEventListener('message', (event) => {
            const liveData = JSON.parse(event.data);
            onMessage(liveData);
        });

        return eventSource;
    } catch(error) {
        console.error('Error subscribing to waiting room updates:', error);
        throw error;
    }
};

export const onAccept = async () => {
    try {
        const token = await getToken();
        const response = await axios.post(`${API_URL}/api/sessions/accept-session`, {}, {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error starting session:', error.response.data.message);
        Alert.alert('Error', 'There was an issue starting the session. Please try again.');
    }
};

export const generateVideoToken = async() => {
    try {
        const token = await getToken(); 
        const response = await axios.post(`${API_URL}/api/sessions/video-token`, {}, {
            headers: {
                Authorization: token // Include the Authorization header
            }
        });
        return response.data.token; // Return the video token from the backend
    } catch (error) {
        console.error('Error getting video token:', error.response.data.message);
        throw new Error('Unable to get video token');
    }
};
