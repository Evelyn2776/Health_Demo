import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Card,
  useColorModeValue,
  Icon,
  Center,
} from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { scanFood } from '../redux/slices/foodSlice';

const FoodScannerScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isScanning, setIsScanning] = useState(false);

  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  // Simulate food scan
  const simulateScan = async () => {
    setIsScanning(true);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a sample Nigerian food
    const sampleFood = {
      id: 'jollof-rice',
      name: 'Jollof Rice',
      category: 'Rice Dishes',
      confidence: 0.92,
      nutritionPer100g: {
        calories: 350,
        protein: 8.5,
        carbohydrates: 65,
        fat: 5.2,
      },
      ingredients: ['Rice', 'Tomatoes', 'Peppers', 'Onions', 'Chicken', 'Vegetable Oil'],
      portionSize: '1 plate',
    };
    
    dispatch(scanFood(sampleFood));
    setIsScanning(false);
    
    // Navigate to add food with the scanned food
    navigation.navigate('AddFood', { food: sampleFood });
  };

  return (
    <Box flex={1} bg={bgColor} safeArea>
      <VStack space={4} p={4} flex={1}>
        {/* Header */}
        <HStack alignItems="center" justifyContent="space-between">
          <Button
            variant="ghost"
            leftIcon={<Icon as={<Ionicons name="arrow-back" />} size={5} />}
            onPress={() => navigation.goBack()}
          >
            Back
          </Button>
          <Heading size="lg" color={textColor}>
            Food Scanner
          </Heading>
          <Box w={10} />
        </HStack>

        {/* Scanner Placeholder */}
        <Card
          bg={cardBgColor}
          borderColor={borderColor}
          borderWidth={1}
          flex={1}
          alignItems="center"
          justifyContent="center"
        >
          <VStack space={4} alignItems="center">
            <Icon as={<MaterialIcons name="camera-alt" />} size={16} color="gray.400" />
            <Heading size="md" color="gray.500">
              Camera Not Available
            </Heading>
            <Text textAlign="center" color="gray.500" px={4}>
              For a complete experience, install expo-camera:
            </Text>
            <Text fontSize="xs" color="gray.400" textAlign="center" px={4}>
              npm install expo-camera
            </Text>
          </VStack>
        </Card>

        {/* Demo Scan Button */}
        <Button
          colorScheme="primary"
          onPress={simulateScan}
          isLoading={isScanning}
          size="lg"
          py={4}
          mb={10}
          leftIcon={<Icon as={<MaterialIcons name="camera" />} size={5} />}
        >
          {isScanning ? 'Scanning...' : 'Demo Scan (Try Me!)'}
        </Button>

        {/* Instructions */}
        <Card
          bg={cardBgColor}
          borderColor={borderColor}
          borderWidth={1}
          p={4}
          mb={10}
        >
          <VStack space={2}>
            <Heading size="sm" color={textColor}>
              How to Use
            </Heading>
            <Text fontSize="sm" color="gray.500">
              1. Install expo-camera: <Text color="primary.500">npm install expo-camera</Text>
            </Text>
            <Text fontSize="sm" color="gray.500">
              2. Add "expo-camera" to plugins in app.json
            </Text>
            <Text fontSize="sm" color="gray.500">
              3. Restart the app with: <Text color="primary.500">npx expo start -c</Text>
            </Text>
            <Text fontSize="sm" color="gray.500" mt={2}>
              For now, use the "Demo Scan" button to test the food scanning flow.
            </Text>
          </VStack>
        </Card>
      </VStack>
    </Box>
  );
};

export default FoodScannerScreen;
