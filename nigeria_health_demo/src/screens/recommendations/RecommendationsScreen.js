import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Icon,
  Card,
  Divider,
} from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const RecommendationsScreen = () => {
  const navigation = useNavigation();
  
  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  // Sample Nigerian food recommendations
  const foodRecommendations = [
    {
      name: 'Jollof Rice with Chicken',
      category: 'Lunch/Dinner',
      calories: 450,
      description: 'A balanced meal with protein and carbs',
      icon: 'restaurant',
    },
    {
      name: 'Eba with Egusi Soup',
      category: 'Lunch/Dinner',
      calories: 500,
      description: 'Traditional Nigerian swallow with protein-rich soup',
      icon: 'restaurant',
    },
    {
      name: 'Moi Moi with Custard',
      category: 'Breakfast',
      calories: 350,
      description: 'High-protein breakfast option',
      icon: 'restaurant',
    },
  ];

  // Sample exercise recommendations
  const exerciseRecommendations = [
    {
      name: 'Morning Walk',
      duration: '30 minutes',
      calories: 150,
      description: 'Great for cardiovascular health',
      icon: 'walking',
    },
    {
      name: 'Body Weight Exercises',
      duration: '20 minutes',
      calories: 200,
      description: 'Push-ups, squats, and lunges',
      icon: 'fitness-center',
    },
    {
      name: 'Dancing',
      duration: '45 minutes',
      calories: 300,
      description: 'Fun way to burn calories',
      icon: 'music-note',
    },
  ];

  const renderRecommendationCard = (item, index) => (
    <Card
      key={index}
      bg={cardBgColor}
      borderColor={borderColor}
      borderWidth={1}
      p={4}
      mb={3}
    >
      <HStack space={3} alignItems="center">
        <Box
          bg="primary.100"
          p={3}
          borderRadius={10}
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={MaterialIcons} name={item.icon} color="primary.500" size={6} />
        </Box>
        <VStack flex={1}>
          <Heading size="sm" color={textColor}>
            {item.name}
          </Heading>
          <Text fontSize="xs" color="gray.500">
            {item.category || item.duration}
          </Text>
          <Text fontSize="sm" color={textColor} mt={1}>
            {item.description}
          </Text>
          {item.calories && (
            <Text fontSize="xs" color="primary.500" mt={1}>
              ~{item.calories} kcal
            </Text>
          )}
        </VStack>
      </HStack>
    </Card>
  );

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
            Recommendations
          </Heading>
          <Box w={10} />
        </HStack>

        {/* Food Recommendations */}
        <VStack space={3}>
          <HStack alignItems="center" justifyContent="space-between" mb={2}>
            <Heading size="md" color={textColor}>
              Food Recommendations
            </Heading>
            <Button
              size="sm"
              colorScheme="primary"
              variant="ghost"
              onPress={() => navigation.navigate('FoodRecommendations')}
            >
              View All
            </Button>
          </HStack>
          
          {foodRecommendations.map((food, index) => renderRecommendationCard(food, index))}
        </VStack>

        <Divider my={4} />

        {/* Exercise Recommendations */}
        <VStack space={3}>
          <HStack alignItems="center" justifyContent="space-between" mb={2}>
            <Heading size="md" color={textColor}>
              Exercise Recommendations
            </Heading>
            <Button
              size="sm"
              colorScheme="secondary"
              variant="ghost"
              onPress={() => navigation.navigate('ExerciseRecommendations')}
            >
              View All
            </Button>
          </HStack>
          
          {exerciseRecommendations.map((exercise, index) => renderRecommendationCard(exercise, index))}
        </VStack>

        <Box h={20} />
      </VStack>
    </Box>
  );
};

export default RecommendationsScreen;
