import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Alert, Switch, Modal } from 'react-native';
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchDoctorsList } from '../services/api';
import axios from 'axios';
import { stickyWorkers } from '../../metro.config';
import debounce from 'lodash.debounce'

export default function DoctorListScreen({ navigation }) {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ doctorSpecialty: '', minRating: 0, doctorAvailability: false });
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [applyTrigger, setApplyTrigger] = useState(false);

    const debouncedLoadDoctors = useCallback(
        debounce(async (query, pageNumber, appliedFilters) => {
            if (!isFetchingMore) setLoading(true);
            try {
                const response = await fetchDoctorsList(query, pageNumber, appliedFilters);
                if (page === 1) {
                    setDoctors(response.results);
                } else {
                    setDoctors((prev) => [...prev, ...response.results]);
                }
                setHasMore(response.hasMore);
            } catch (error) {
                console.log('Error fetching doctors:', error);
                Alert.alert('Error', 'Failed to load doctors. Please try again');
            } finally {
                setLoading(false);
                setIsFetchingMore(false);
            }
        }, 500),
        []
    );

    //Load doctors when the component mounts or searchquery changes
    useEffect(() => {
        debouncedLoadDoctors(searchQuery, page, filters);
    }, [searchQuery, page, applyTrigger]);

    const fetchMoreDoctors = () => {
        if (hasMore && !isFetchingMore) {
            setIsFetchingMore(true);
            setPage((prevPage) => prevPage + 1);
        }
    }

    const clearSearch = () => {
        setSearchQuery('');
        setPage(1);
    }

    const applyFilters = () => {
        setModalVisible(false);
        setPage(1);
        setApplyTrigger((prev) => !prev);
    }

    const resetFilters = () => {
        setFilters({ doctorSpecialty: '', minRating: 0, doctorAvailability: false });
        setModalVisible(false);
        setPage(1);
    }

    if (loading && page === 1) {
        return (
            <LoadingContainer>
                <ActivityIndicator size='20' color='#009688' />
            </LoadingContainer>
        )
    }

    return (
        <Container>
            <Header>
                <SearchContainer>
                    <SearchInput
                        placeholder="Search doctors by name or specialty"
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                    {
                        searchQuery.length > 0 && (
                            <ClearButton onPress={clearSearch}>
                                <Icon name="times" size={10} color='#666' />
                            </ClearButton>
                        )
                    }
                </SearchContainer>
                <FilterButton onPress={() => setModalVisible(true)}>
                    <Icon name="sliders" size={24} color="#333" />
                </FilterButton>
            </Header>
            {
                doctors.length === 0 ?
                    (<NoResultsText>No doctors found. Try another search.</NoResultsText>) :
                    <DoctorList
                        data={doctors}
                        keyExtractor={(item) => item._id}
                        numColumns={2}
                        onEndReached={fetchMoreDoctors}
                        onEndReachedThreshold={0.5} // Fetch more when scrolling is near the end
                        ListFooterComponent={
                            isFetchingMore ? (
                                <ActivityIndicator size='10' color='#009688' />
                            ) : null
                        }
                        renderItem={({ item }) => (
                            <DoctorCard>
                                {item.available && <PurpleDot />}
                                <DoctorImage source={{ uri: item.photoUrl }} />
                                <DoctorDetails>
                                    <DoctorName>Dr. {item.name}</DoctorName>
                                    <DoctorSpecialty>{item.specialty}</DoctorSpecialty>
                                    <RatingContainer>
                                        <Icon name='star' size={16} color='#FFD700' />
                                        <Rating>{item.rating.toFixed(1)}</Rating>
                                        <ReviewCount>({item.reviewCount} reviews)</ReviewCount>
                                    </RatingContainer>
                                </DoctorDetails>
                            </DoctorCard>
                        )}
                    />
            }
            <Modal
                visible={modalVisible}
                // modalVisible={modalVisible}
                transperant={true}
                animationType="slide"
                onnRequestClose={() => setModalVisible(false)}>
                <ModalContainer>
                    <ModalContent>
                        <FilterTitle>Filter Options</FilterTitle>
                        <FilterOption>
                            <FilterLabel>Specialty</FilterLabel>
                            <FilterInput
                                placeholder='Enter specialty (e.g., Cardiologist'
                                value={filters.doctorSpecialty}
                                onChangeText={(text) => setFilters({ ...filters, doctorSpecialty: text })} />
                        </FilterOption>
                        <FilterOption>
                            <FilterLabel>Minimum Rating</FilterLabel>
                            <FilterInput
                                placeholder="Minimum Rating (e.g., 4)"
                                keyboardType="numeric"
                                value={filters.minRating.toString()}
                                onChangeText={(text) => setFilters({ ...filters, minRating: parseFloat(text) || 0 })} />
                        </FilterOption>
                        <FilterOption>
                            <FilterLabel>Available Doctors Only</FilterLabel>
                            <Switch
                                value={filters.doctorAvailability}
                                onValueChange={(value) => setFilters({ ...filters, doctorAvailability: value })}
                            />
                        </FilterOption>
                        <ModalActions>
                            <ApplyButton onPress={applyFilters}>
                                <ButtonText>Apply</ButtonText>
                            </ApplyButton>
                            <CancelButton onPress={resetFilters}>
                                <ButtonText>Reset</ButtonText>
                            </CancelButton>
                        </ModalActions>
                    </ModalContent>
                </ModalContainer>
            </Modal>
        </Container>
    )
};

const Container = styled.View`
    flex: 1;
    background-color: #ffffff;
    padding: 10px;
`;

const Header = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

const LoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const SearchContainer = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
`;

//justify-content: center;


const SearchInput = styled.TextInput`
    flex: 1;
    height: 50px;
    border: 1px solid #ddd;
    border-radius:8px;
    padding: 10px;
    font-size: 16px;
`;

const ClearButton = styled.TouchableHighlight`
    margin-left: 10px;
`;

const DoctorList = styled.FlatList`
    width: 100%;
`;

const DoctorCard = styled.View`
    flex: 1;
    background-color: #f9f9f9;
    padding: 15px;
    margin: 10px;
    border-radius: 8px;
    align-items: center;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
    elevation: 3;
    position: relative;
`;

const PurpleDot = styled.View`
    width: 12px;
    height: 12px;
    background-color: #800080; /* Purple color */
    border-radius: 6px; /* Make it a circle */
    position: absolute;
    top: 10px;
    right: 10px; /* Position it in the top-right corner */
    z-index: 1;
`;

const DoctorImage = styled.Image`
    width: 80px;
    height: 80px;
    border-radius: 40px;
    margin-bottom: 10px;
`;

const DoctorDetails = styled.View`
    align-items: center;
`;

const DoctorName = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #333;
    text-align: center;
`;

const DoctorSpecialty = styled.Text`
    font-size: 14px;
    color: #666;
    text-align: center;
    margin-vertical: 4px;
`;

const RatingContainer = styled.View`
    flex-direction: row;
    align-items: center;
    margin-top:5px;
`;

const Rating = styled.Text`
    font-size: 14px;
    color: #333;
    margin-left: 5px;
`;

const ReviewCount = styled.Text`
    font-size: 12px;
    color: #666;
    margin-left: 5px;
`;

const NoResultsText = styled.Text`
    font-size: 18px;
    color: #666;
    text-align: center;
    margin-top: 20px;
`;

const ModalContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
    width: 90%;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    elevation: 5;
`;

const FilterTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
    text-align: center;
    color: #333;
`;

const FilterOption = styled.View`
    margin-bottom: 15px;
`;

const FilterLabel = styled.Text`
    font-size: 16px;
    margin-bottom: 5px;
    color: #333;
`;

const FilterInput = styled.TextInput`
    height: 40px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 5px;
    font-size: 16px;
`;

const ModalActions = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
`;

const ApplyButton = styled.TouchableOpacity`
    background-color: #009688;
    padding: 10px 20px;
    border-radius: 8px;
`;

const CancelButton = styled.TouchableOpacity`
    background-color: #ccc;
    padding: 10px 20px;
    border-radius: 8px;
`;

const ButtonText = styled.Text`
    color: #fff;
    font-size: 16px;
    font-weight: bold;
`;

const FilterButton = styled.TouchableOpacity`
    border: 1px solid red;
    margin-left: 10px;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
`;
