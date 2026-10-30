import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Icon,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const bgColor = useColorModeValue('white', 'dark.background');
  const textColor = useColorModeValue('light.text', 'dark.text');

  return (
    <Box flex={1} bg={bgColor} safeArea>
      <VStack space={8} p={8} flex={1} alignItems="center" justifyContent="center">
        <Icon as={<Ionicons name="heart" />} size={20} color="primary.500" />
        
        <Heading size="2xl" color={textColor} textAlign="center">
          Nigerian Health
        </Heading>
        
        <Text fontSize="lg" color="gray.500" textAlign="center">
          Track your nutrition, activity, and health
        </Text>
        
        <Text fontSize="md" color="gray.600" textAlign="center">
          The ultimate health app for Nigerians
        </Text>
        
        <VStack space={4} w="100%">
          <Button
            colorScheme="primary"
            size="lg"
            py={4}
            onPress={() => navigation.navigate('Dashboard')}
          >
            Get Started
          </Button>
          
          <Button
            colorScheme="secondary"
            size="lg"
            py={4}
            variant="outline"
            onPress={() => navigation.navigate('Login')}
          >
            Log In
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default OnboardingScreen;
