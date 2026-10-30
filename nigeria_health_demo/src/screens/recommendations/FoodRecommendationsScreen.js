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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FoodRecommendationsScreen = () => {
  const navigation = useNavigation();
  
  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  // Nigerian food recommendations
  const nigerianFoods = [
    {
      name: 'Jollof Rice with Chicken',
      category: 'Rice Dishes',
      calories: 450,
      protein: 25,
      carbs: 65,
      fat: 8,
      description: 'A popular West African one-pot rice dish',
    },
    {
      name: 'Eba with Egusi Soup',
      category: 'Swallow Foods',
      calories: 500,
      protein: 15,
      carbs: 70,
      fat: 12,
      description: 'Fermented cassava with melon seed soup',
    },
    {
      name: 'Amala with Ewedu Soup',
      category: 'Swallow Foods',
      calories: 480,
      protein: 12,
      carbs: 75,
      fat: 10,
      description: 'Yam flour swallow with jute leaves soup',
    },
    {
      name: 'Pounded Yam with Vegetable Soup',
      category: 'Swallow Foods',
      calories: 420,
      protein: 10,
      carbs: 70,
      fat: 8,
      description: 'Pounded yam with assorted vegetable soup',
    },
    {
      name: 'Fried Rice',
      category: 'Rice Dishes',
      calories: 380,
      protein: 12,
      carbs: 55,
      fat: 10,
      description: 'Nigerian-style fried rice with vegetables',
    },
    {
      name: 'Moi Moi',
      category: 'Proteins',
      calories: 220,
      protein: 12,
      carbs: 20,
      fat: 10,
      description: 'Steamed bean pudding',
    },
    {
      name: 'Beans Pudding (Akara)',
      category: 'Breakfast',
      calories: 250,
      protein: 10,
      carbs: 25,
      fat: 12,
      description: 'Deep-fried bean cakes',
    },
    {
      name: 'Pap (Ogi)',
      category: 'Breakfast',
      calories: 150,
      protein: 3,
      carbs: 30,
      fat: 2,
      description: 'Fermented corn or millet pudding',
    },
    {
      name: 'Puff Puff',
      category: 'Snacks',
      calories: 180,
      protein: 3,
      carbs: 25,
      fat: 8,
      description: 'Deep-fried dough balls',
    },
    {
      name: 'Zobo Drink',
      category: 'Drinks',
      calories: 50,
      protein: 0.5,
      carbs: 12,
      fat: 0,
      description: 'Hibiscus tea rich in vitamin C',
    },
  ];

  const renderFoodItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('AddFood', { food: item })}
      p={3}
      bg={cardBgColor}
      borderColor={borderColor}
      borderWidth={1}
      borderRadius={8}
      mb={2}
    >
      <HStack space={3} alignItems="center">
        <Box
          bg="primary.100"
          p={2}
          borderRadius={8}
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={<MaterialIcons name="restaurant" />} color="primary.500" size={6} />
        </Box>
        <VStack flex={1}>
          <Heading size="sm" color={textColor}>
            {item.name}
          </Heading>
          <Text fontSize="xs" color="gray.500">
            {item.category} • {item.calories} kcal
          </Text>
          <Text fontSize="xs" color="gray.600" numberOfLines={1}>
            {item.description}
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
            Nigerian Food Recommendations
          </Heading>
          <Box w={10} />
        </HStack>

        {/* Filter Options */}
        <HStack space={2} mb={4}>
          <Button size="sm" colorScheme="primary" variant="outline">
            All
          </Button>
          <Button size="sm" colorScheme="primary" variant="outline">
            Breakfast
          </Button>
          <Button size="sm" colorScheme="primary" variant="outline">
            Lunch/Dinner
          </Button>
          <Button size="sm" colorScheme="primary" variant="outline">
            Snacks
          </Button>
          <Button size="sm" colorScheme="primary" variant="outline">
            Drinks
          </Button>
        </HStack>

        {/* Food List */}
        <FlatList
          data={nigerianFoods}
          renderItem={renderFoodItem}
          keyExtractor={(item, index) => item.name || index.toString()}
          ListEmptyComponent={
            <Text textAlign="center" color="gray.500" py={8}>
              No foods found
            </Text>
          }
        />

        <Box h={20} />
      </VStack>
    </Box>
  );
};

export default FoodRecommendationsScreen;
