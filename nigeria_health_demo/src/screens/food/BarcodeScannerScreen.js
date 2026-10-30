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
} from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { scanBarcode } from '../redux/slices/foodSlice';

const BarcodeScannerScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isScanning, setIsScanning] = useState(false);
  const [barcode, setBarcode] = useState('');

  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  // Simulate barcode scan
  const simulateScan = async () => {
    setIsScanning(true);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a sample food
    const sampleFood = {
      id: 'puff-puff',
      name: 'Puff Puff',
      category: 'Snacks',
      nutritionPer100g: {
        calories: 180,
        protein: 3,
        carbohydrates: 25,
        fat: 8,
      },
      portionSizes: [
        { name: '1 piece', weight: 50 },
        { name: '5 pieces', weight: 250 },
      ],
    };
    
    dispatch(scanBarcode(sampleFood));
    setIsScanning(false);
    
    // Navigate to add food with the scanned food
    navigation.navigate('AddFood', { food: sampleFood });
  };

  return (
    <Box flex={1} bg={bgColor} safeArea>
      <VStack space={4} p={4}>
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
            Barcode Scanner
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
            <Icon as={<MaterialIcons name="barcode" />} size={16} color="gray.400" />
            <Heading size="md" color="gray.500">
              Barcode Scanner
            </Heading>
            <Text textAlign="center" color="gray.500" px={4}>
              For a complete experience, install expo-barcode-scanner:
            </Text>
            <Text fontSize="xs" color="gray.400" textAlign="center" px={4}>
              npm install expo-barcode-scanner
            </Text>
          </VStack>
        </Card>

        {/* Demo Scan Button */}
        <Button
          colorScheme="secondary"
          onPress={simulateScan}
          isLoading={isScanning}
          size="lg"
          py={4}
          mb={10}
          leftIcon={<Icon as={<Ionicons name="barcode" />} size={5} />}
        >
          {isScanning ? 'Scanning...' : 'Demo Scan (Try Me!)'}
        </Button>

        {/* Manual Barcode Entry */}
        <Card
          bg={cardBgColor}
          borderColor={borderColor}
          borderWidth={1}
          p={4}
          mb={10}
        >
          <VStack space={3}>
            <Heading size="sm" color={textColor}>
              Manual Entry
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Enter a barcode to look up a food item.
            </Text>
            <Button
              colorScheme="primary"
              variant="outline"
              onPress={() => navigation.navigate('AddFood')}
            >
              Add Food Manually
            </Button>
          </VStack>
        </Card>
      </VStack>
    </Box>
  );
};

export default BarcodeScannerScreen;
