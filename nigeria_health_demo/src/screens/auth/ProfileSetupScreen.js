import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  useColorModeValue,
  Icon,
  Select,
  HStack,
} from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { tempLogin } from '../../redux/slices/userSlice';

const ProfileSetupScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    height: '',
    weight: '',
    targetWeight: '',
  });

  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleNext = () => {
    if (step === 1 && (!profile.firstName || !profile.lastName)) {
      alert('Please enter your name');
      return;
    }
    if (step === 2 && (!profile.gender || !profile.dateOfBirth)) {
      alert('Please select gender and date of birth');
      return;
    }
    if (step === 3 && (!profile.height || !profile.weight)) {
      alert('Please enter height and weight');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    // Create demo user with profile data
    const demoUser = {
      id: 'demo-user',
      email: 'demo@example.com',
      profile: {
        ...profile,
        height: parseFloat(profile.height) || 175,
        currentWeight: parseFloat(profile.weight) || 75,
        targetWeight: parseFloat(profile.targetWeight) || 70,
      },
      preferences: {
        activityLevel: 'moderately active',
        weightGoal: 'maintain',
        dietaryRestrictions: [],
        unitSystem: 'metric',
        theme: 'auto',
        notificationSettings: {
          calorieAlerts: true,
          waterReminders: true,
          activityReminders: true,
          dailySummary: true,
          weeklyReport: true,
        },
      },
    };
    
    await dispatch(tempLogin(demoUser));
    navigation.navigate('Dashboard');
  };

  // Step 1: Personal Info
  if (step === 1) {
    return (
      <Box flex={1} bg={bgColor} safeArea>
        <VStack space={4} p={4} flex={1}>
          <Heading size="lg" color={textColor}>
            Set Up Your Profile
          </Heading>
          <Text fontSize="md" color="gray.500">
            Step 1 of 3
          </Text>

          <VStack space={4} flex={1}>
            <Input
              placeholder="First Name"
              value={profile.firstName}
              onChangeText={(text) => handleChange('firstName', text)}
              InputLeftElement={
                <Icon as={<MaterialIcons name="person" />} color="gray.400" size={5} ml={3} />
              }
              borderColor={borderColor}
              bg={cardBgColor}
              color={textColor}
              placeholderTextColor="gray.400"
            />
            <Input
              placeholder="Last Name"
              value={profile.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
              InputLeftElement={
                <Icon as={<MaterialIcons name="person" />} color="gray.400" size={5} ml={3} />
              }
              borderColor={borderColor}
              bg={cardBgColor}
              color={textColor}
              placeholderTextColor="gray.400"
            />
          </VStack>

          <Button
            colorScheme="primary"
            onPress={handleNext}
            size="lg"
            py={4}
          >
            Next
          </Button>
        </VStack>
      </Box>
    );
  }

  // Step 2: Gender and DOB
  if (step === 2) {
    return (
      <Box flex={1} bg={bgColor} safeArea>
        <VStack space={4} p={4} flex={1}>
          <Heading size="lg" color={textColor}>
            About You
          </Heading>
          <Text fontSize="md" color="gray.500">
            Step 2 of 3
          </Text>

          <VStack space={4} flex={1}>
            <Select
              selectedValue={profile.gender}
              minWidth="200"
              placeholder="Select Gender"
              onValueChange={(value) => handleChange('gender', value)}
              borderColor={borderColor}
              bg={cardBgColor}
              _selectedItem={{ bg: 'primary.100' }}
            >
              <Select.Item label="Male" value="male" />
              <Select.Item label="Female" value="female" />
              <Select.Item label="Other" value="other" />
              <Select.Item label="Prefer not to say" value="prefer-not-to-say" />
            </Select>

            <Input
              placeholder="Date of Birth (e.g., 1990-01-01)"
              value={profile.dateOfBirth}
              onChangeText={(text) => handleChange('dateOfBirth', text)}
              InputLeftElement={
                <Icon as={<MaterialIcons name="cake" />} color="gray.400" size={5} ml={3} />
              }
              borderColor={borderColor}
              bg={cardBgColor}
              color={textColor}
              placeholderTextColor="gray.400"
            />
          </VStack>

          <HStack space={2}>
            <Button
              colorScheme="gray"
              onPress={() => setStep(1)}
              variant="outline"
              flex={1}
            >
              Back
            </Button>
            <Button
              colorScheme="primary"
              onPress={handleNext}
              flex={1}
            >
              Next
            </Button>
          </HStack>
        </VStack>
      </Box>
    );
  }

  // Step 3: Health Metrics
  if (step === 3) {
    return (
      <Box flex={1} bg={bgColor} safeArea>
        <VStack space={4} p={4} flex={1}>
          <Heading size="lg" color={textColor}>
            Health Information
          </Heading>
          <Text fontSize="md" color="gray.500">
            Step 3 of 3
          </Text>

          <VStack space={4} flex={1}>
            <HStack space={2}>
              <Input
                flex={1}
                placeholder="Height (cm)"
                value={profile.height}
                onChangeText={(text) => handleChange('height', text)}
                keyboardType="numeric"
                InputLeftElement={
                  <Icon as={<MaterialIcons name="straighten" />} color="gray.400" size={5} ml={3} />
                }
                borderColor={borderColor}
                bg={cardBgColor}
                color={textColor}
                placeholderTextColor="gray.400"
              />
              <Input
                flex={1}
                placeholder="Weight (kg)"
                value={profile.weight}
                onChangeText={(text) => handleChange('weight', text)}
                keyboardType="numeric"
                InputLeftElement={
                  <Icon as={<MaterialIcons name="monitor-weight" />} color="gray.400" size={5} ml={3} />
                }
                borderColor={borderColor}
                bg={cardBgColor}
                color={textColor}
                placeholderTextColor="gray.400"
              />
            </HStack>
            <Input
              placeholder="Target Weight (kg)"
              value={profile.targetWeight}
              onChangeText={(text) => handleChange('targetWeight', text)}
              keyboardType="numeric"
              InputLeftElement={
                <Icon as={<MaterialIcons name="fitness-center" />} color="gray.400" size={5} ml={3} />
              }
              borderColor={borderColor}
              bg={cardBgColor}
              color={textColor}
              placeholderTextColor="gray.400"
            />
          </VStack>

          <HStack space={2}>
            <Button
              colorScheme="gray"
              onPress={() => setStep(2)}
              variant="outline"
              flex={1}
            >
              Back
            </Button>
            <Button
              colorScheme="primary"
              onPress={handleSubmit}
              flex={1}
            >
              Complete Setup
            </Button>
          </HStack>
        </VStack>
      </Box>
    );
  }

  return null;
};

export default ProfileSetupScreen;
