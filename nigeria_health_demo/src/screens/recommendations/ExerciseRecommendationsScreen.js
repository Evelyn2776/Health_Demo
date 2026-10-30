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
  FlatList,
  Pressable,
} from 'native-base';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ExerciseRecommendationsScreen = () => {
  const navigation = useNavigation();
  
  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  // Exercise recommendations
  const exercises = [
    {
      name: 'Morning Walk',
      category: 'Cardio',
      duration: '30-45 minutes',
      calories: 150,
      description: 'Great for cardiovascular health and gentle on joints',
      icon: 'walking',
    },
    {
      name: 'Jogging/Running',
      category: 'Cardio',
      duration: '20-30 minutes',
      calories: 250,
      description: 'Excellent for burning calories and improving endurance',
      icon: 'running',
    },
    {
      name: 'Cycling',
      category: 'Cardio',
      duration: '30-45 minutes',
      calories: 200,
      description: 'Low impact cardio that strengthens leg muscles',
      icon: 'directions-bike',
    },
    {
      name: 'Swimming',
      category: 'Cardio',
      duration: '30-45 minutes',
      calories: 300,
      description: 'Full-body workout that is easy on the joints',
      icon: 'pool',
    },
    {
      name: 'Dancing',
      category: 'Cardio',
      duration: '45-60 minutes',
      calories: 300,
      description: 'Fun way to burn calories, great for Nigerian music!',
      icon: 'music-note',
    },
    {
      name: 'Farming Activities',
      category: 'Traditional',
      duration: '60+ minutes',
      calories: 350,
      description: 'Traditional Nigerian agricultural work',
      icon: 'agriculture',
    },
    {
      name: 'Body Weight Exercises',
      category: 'Strength',
      duration: '20-30 minutes',
      calories: 200,
      description: 'Push-ups, squats, lunges, planks',
      icon: 'fitness-center',
    },
    {
      name: 'Yoga',
      category: 'Flexibility',
      duration: '30-45 minutes',
      calories: 150,
      description: 'Improves flexibility, balance, and mental health',
      icon: 'self-improvement',
    },
    {
      name: 'Football',
      category: 'Sports',
      duration: '60+ minutes',
      calories: 400,
      description: 'Popular Nigerian sport, great for team building',
      icon: 'sports-soccer',
    },
    {
      name: 'Basketball',
      category: 'Sports',
      duration: '45-60 minutes',
      calories: 350,
      description: 'High-intensity sport for cardiovascular health',
      icon: 'sports-basketball',
    },
  ];

  const renderExerciseItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('AddActivity', { activity: item })}
      p={3}
      bg={cardBgColor}
      borderColor={borderColor}
      borderWidth={1}
      borderRadius={8}
      mb={2}
    >
      <HStack space={3} alignItems="center">
        <Box
          bg="secondary.100"
          p={2}
          borderRadius={8}
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={FontAwesome5} name={item.icon} color="secondary.500" size={6} />
        </Box>
        <VStack flex={1}>
          <Heading size="sm" color={textColor}>
            {item.name}
          </Heading>
          <Text fontSize="xs" color="gray.500">
            {item.category} • {item.duration}
          </Text>
          <Text fontSize="xs" color="gray.600" numberOfLines={1}>
            {item.description}
          </Text>
          <Text fontSize="xs" color="secondary.500" mt={1}>
            ~{item.calories} kcal
          </Text>
        </VStack>
        <Icon as={<Ionicons name="chevron-forward" />} color="gray.400" size={5} />
      </HStack>
    </Pressable>
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
            Exercise Recommendations
          </Heading>
          <Box w={10} />
        </HStack>

        {/* Filter Options */}
        <HStack space={2} mb={4} flexWrap="wrap">
          <Button size="sm" colorScheme="secondary" variant="outline">
            All
          </Button>
          <Button size="sm" colorScheme="secondary" variant="outline">
            Cardio
          </Button>
          <Button size="sm" colorScheme="secondary" variant="outline">
            Strength
          </Button>
          <Button size="sm" colorScheme="secondary" variant="outline">
            Flexibility
          </Button>
          <Button size="sm" colorScheme="secondary" variant="outline">
            Sports
          </Button>
          <Button size="sm" colorScheme="secondary" variant="outline">
            Traditional
          </Button>
        </HStack>

        {/* Exercise List */}
        <FlatList
          data={exercises}
          renderItem={renderExerciseItem}
          keyExtractor={(item, index) => item.name || index.toString()}
          ListEmptyComponent={
            <Text textAlign="center" color="gray.500" py={8}>
              No exercises found
            </Text>
          }
        />

        <Box h={20} />
      </VStack>
    </Box>
  );
};

export default ExerciseRecommendationsScreen;
