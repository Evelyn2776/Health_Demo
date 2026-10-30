import React, { useState, useEffect } from 'react';
import {
  Box,
  ScrollView,
  VStack,
  HStack,
  Text,
  Heading,
  Input,
  Icon,
  Button,
  Card,
  useColorModeValue,
  Divider,
  FlatList,
  Pressable,
  Modal,
  FormControl,
} from 'native-base';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { searchFoods, getFoodLogs, clearScannedFood } from '../../redux/slices/foodSlice';
import { useHealthData } from '../../context/HealthDataContext';
import moment from 'moment';

const FoodScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { foodLogs, dailySummary, dailyCalorieGoal, refreshFoodData } = useHealthData();
  const { foods, searchedFoods, isLoading, scannedFood } = useSelector((state) => state.food);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [recentFoods, setRecentFoods] = useState([]);

  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  // Nigerian food categories
  const categories = [
    'All',
    'Swallow Foods',
    'Soups',
    'Rice Dishes',
    'Proteins',
    'Snacks',
    'Drinks',
    'Breakfast',
  ];

  // Popular Nigerian foods
  const popularNigerianFoods = [
    { name: 'Jollof Rice', category: 'Rice Dishes', calories: 350 },
    { name: 'Eba with Egusi Soup', category: 'Swallow Foods', calories: 450 },
    { name: 'Amala with Ewedu', category: 'Swallow Foods', calories: 400 },
    { name: 'Pounded Yam with Vegetable Soup', category: 'Swallow Foods', calories: 380 },
    { name: 'Fried Rice', category: 'Rice Dishes', calories: 320 },
    { name: 'Moi Moi', category: 'Proteins', calories: 220 },
    { name: 'Beans Pudding', category: 'Proteins', calories: 200 },
    { name: 'Puff Puff', category: 'Snacks', calories: 180 },
    { name: 'Chin Chin', category: 'Snacks', calories: 200 },
    { name: 'Zobo Drink', category: 'Drinks', calories: 50 },
    { name: 'Kunu', category: 'Drinks', calories: 120 },
    { name: 'Akara', category: 'Breakfast', calories: 250 },
    { name: 'Pap (Ogi)', category: 'Breakfast', calories: 150 },
  ];

  // Load recent foods
  useEffect(() => {
    if (foodLogs && foodLogs.length > 0) {
      const uniqueFoods = [];
      const seen = new Set();
      
      foodLogs.slice(0, 5).forEach(log => {
        if (log.items && log.items.length > 0) {
          log.items.forEach(item => {
            if (item.foodId && !seen.has(item.foodId)) {
              seen.add(item.foodId);
              uniqueFoods.push(item);
            }
          });
        }
      });
      
      setRecentFoods(uniqueFoods);
    }
  }, [foodLogs]);

  // Handle search
  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Search in popular foods first
      const filtered = popularNigerianFoods.filter(food =>
        food.name.toLowerCase().includes(query.toLowerCase())
      );
      
      if (filtered.length > 0) {
        setSearchResults(filtered);
      } else {
        // Search in Redux
        await dispatch(searchFoods(query));
        setSearchResults(searchedFoods);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryModal(false);
    
    if (category === 'All') {
      setSearchResults(popularNigerianFoods);
    } else {
      const filtered = popularNigerianFoods.filter(food => food.category === category);
      setSearchResults(filtered);
    }
  };

  // Handle scanned food
  useEffect(() => {
    if (scannedFood) {
      // Navigate to food details or add food screen
      navigation.navigate('FoodDetails', { food: scannedFood });
      dispatch(clearScannedFood());
    }
  }, [scannedFood, navigation, dispatch]);

  // Calculate remaining calories
  const remainingCalories = dailyCalorieGoal - dailySummary.calories;
  const calorieStatus = remainingCalories < 0 ? 'over' : remainingCalories < dailyCalorieGoal * 0.25 ? 'warning' : 'good';

  const renderFoodItem = ({ item }) => (
    <Pressable
      onPress={() => {
        if (item.foodId) {
          navigation.navigate('FoodDetails', { food: item });
        } else {
          // Create a temporary food object for popular foods
          const tempFood = {
            id: `popular-${item.name}`,
            name: item.name,
            category: item.category,
            nutritionPer100g: {
              calories: item.calories * 10, // Approximate for 100g
              protein: 5,
              carbohydrates: 20,
              fat: 8,
            },
          };
          navigation.navigate('FoodDetails', { food: tempFood });
        }
      }}
    >
      <Card
        bg={cardBgColor}
        borderColor={borderColor}
        borderWidth={1}
        mb={2}
        p={3}
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
            {item.category && (
              <Text fontSize="xs" color="gray.500">
                {item.category}
              </Text>
            )}
            {item.calories && (
              <Text fontSize="xs" color="gray.500">
                ~{item.calories} kcal per serving
              </Text>
            )}
          </VStack>
          <Icon as={<Ionicons name="chevron-forward" />} color="gray.400" size={5} />
        </HStack>
      </Card>
    </Pressable>
  );

  const renderQuickAction = (icon, label, onPress, color) => (
    <Pressable onPress={onPress} flex={1}>
      <Card
        bg={cardBgColor}
        borderColor={borderColor}
        borderWidth={1}
        p={4}
        alignItems="center"
        m={1}
      >
        <Box bg={color} p={3} borderRadius={10} mb={2}>
          <Icon as={icon} color="white" size={7} />
        </Box>
        <Text fontSize="xs" color={textColor} textAlign="center">
          {label}
        </Text>
      </Card>
    </Pressable>
  );

  return (
    <Box flex={1} bg={bgColor} safeArea>
      <VStack space={4} p={4}>
        {/* Header */}
        <HStack alignItems="center" justifyContent="space-between">
          <Heading size="lg" color={textColor}>
            Food Tracker
          </Heading>
          <Button
            leftIcon={<Icon as={<Ionicons name="add" />} size={5} />}
            colorScheme="primary"
            onPress={() => navigation.navigate('AddFood')}
          >
            Add
          </Button>
        </HStack>

        {/* Calorie Summary */}
        <Card
          bg={cardBgColor}
          borderColor={borderColor}
          borderWidth={1}
          p={4}
        >
          <VStack space={2}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontSize="sm" color="gray.500">
                Today's Calories
              </Text>
              <HStack alignItems="center" space={2}>
                <Text
                  fontSize="sm"
                  color={calorieStatus === 'over' ? 'red.500' : calorieStatus === 'warning' ? 'yellow.500' : 'green.500'}
                >
                  {calorieStatus === 'over' ? 'Over limit' : calorieStatus === 'warning' ? 'Almost there' : 'On track'}
                </Text>
                <Icon
                  as={calorieStatus === 'over' ? Ionicons : calorieStatus === 'warning' ? Ionicons : Ionicons}
                  name={calorieStatus === 'over' ? 'warning' : calorieStatus === 'warning' ? 'alert-circle' : 'checkmark-circle'}
                  color={calorieStatus === 'over' ? 'red.500' : calorieStatus === 'warning' ? 'yellow.500' : 'green.500'}
                  size={5}
                />
              </HStack>
            </HStack>
            <HStack alignItems="baseline" space={2}>
              <Heading size="2xl" color={textColor}>
                {dailySummary.calories}
              </Heading>
              <Text fontSize="md" color="gray.500">
                / {dailyCalorieGoal} kcal
              </Text>
            </HStack>
            {remainingCalories > 0 && (
              <Text fontSize="xs" color="gray.500">
                {remainingCalories} calories remaining
              </Text>
            )}
            {remainingCalories < 0 && (
              <Text fontSize="xs" color="red.500">
                {Math.abs(remainingCalories)} calories over
              </Text>
            )}
          </VStack>
        </Card>

        {/* Quick Actions */}
        <Heading size="sm" color={textColor} mb={2}>
          Quick Actions
        </Heading>
        <HStack space={2} mb={4}>
          {renderQuickAction(
            MaterialIcons,
            'camera-alt',
            () => navigation.navigate('FoodScanner'),
            'primary.500'
          )}
          {renderQuickAction(
            Ionicons,
            'barcode-outline',
            () => navigation.navigate('BarcodeScanner'),
            'secondary.500'
          )}
          {renderQuickAction(
            MaterialIcons,
            'search',
            () => setIsSearching(true),
            'green.500'
          )}
          {renderQuickAction(
            Ionicons,
            'list-outline',
            () => navigation.navigate('FoodLog'),
            'orange.500'
          )}
        </HStack>

        <Divider my={2} />

        {/* Search */}
        <FormControl mb={4}>
          <Input
            placeholder="Search Nigerian foods..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              handleSearch(text);
            }}
            InputLeftElement={
              <Icon
                as={<Ionicons name="search" />}
                color="gray.400"
                size={5}
                ml={3}
              />
            }
            InputRightElement={
              searchQuery.length > 0 && (
                <Icon
                  as={<Ionicons name="close" />}
                  color="gray.400"
                  size={5}
                  mr={3}
                  onPress={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                />
              )
            }
            borderColor={borderColor}
            bg={cardBgColor}
            color={textColor}
            placeholderTextColor="gray.400"
          />
        </FormControl>

        {/* Category Filter */}
        <HStack alignItems="center" justifyContent="space-between" mb={4}>
          <Text fontSize="sm" color={textColor}>
            Browse Categories
          </Text>
          <Button
            variant="outline"
            size="sm"
            rightIcon={<Icon as={<Ionicons name="chevron-down" />} size={4} />}
            onPress={() => setShowCategoryModal(true)}
            borderColor={borderColor}
            _text={{ color: textColor }}
          >
            {selectedCategory}
          </Button>
        </HStack>

        {/* Category Modal */}
        <Modal
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          size="lg"
        >
          <Modal.Content bg={cardBgColor}>
            <Modal.Header borderColor={borderColor}>
              <Heading size="md" color={textColor}>
                Select Category
              </Heading>
            </Modal.Header>
            <Modal.Body>
              <VStack space={2}>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'solid' : 'outline'}
                    colorScheme={selectedCategory === category ? 'primary' : 'gray'}
                    onPress={() => handleCategorySelect(category)}
                    justifyContent="flex-start"
                    borderColor={borderColor}
                    _text={{ color: selectedCategory === category ? 'white' : textColor }}
                  >
                    {category}
                  </Button>
                ))}
              </VStack>
            </Modal.Body>
            <Modal.Footer borderColor={borderColor}>
              <Button
                variant="ghost"
                colorScheme="gray"
                onPress={() => setShowCategoryModal(false)}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        {/* Search Results or Popular Foods */}
        <ScrollView showsVerticalScrollIndicator={false} flex={1}>
          {isSearching && searchQuery.length > 0 ? (
            <VStack space={2}>
              {searchResults.length > 0 ? (
                <FlatList
                  data={searchResults}
                  renderItem={renderFoodItem}
                  keyExtractor={(item, index) => item.foodId || item.name || index.toString()}
                  ListEmptyComponent={
                    <Text textAlign="center" color="gray.500" py={4}>
                      No foods found
                    </Text>
                  }
                />
              ) : (
                <Text textAlign="center" color="gray.500" py={4}>
                  Searching...
                </Text>
              )}
            </VStack>
          ) : (
            <VStack space={4}>
              {/* Popular Nigerian Foods */}
              <Heading size="sm" color={textColor} mb={2}>
                Popular Nigerian Foods
              </Heading>
              <FlatList
                data={popularNigerianFoods.filter(food => selectedCategory === 'All' || food.category === selectedCategory)}
                renderItem={renderFoodItem}
                keyExtractor={(item, index) => item.name || index.toString()}
                scrollEnabled={false}
              />

              {/* Recent Foods */}
              {recentFoods.length > 0 && (
                <>
                  <Divider my={4} />
                  <Heading size="sm" color={textColor} mb={2}>
                    Recently Logged
                  </Heading>
                  <FlatList
                    data={recentFoods}
                    renderItem={renderFoodItem}
                    keyExtractor={(item, index) => item.foodId || index.toString()}
                    scrollEnabled={false}
                  />
                </>
              )}

              {/* Nigerian Food Recommendations */}
              <Divider my={4} />
              <Card
                bg={cardBgColor}
                borderColor={borderColor}
                borderWidth={1}
                p={4}
                onPress={() => navigation.navigate('NigerianFoods')}
              >
                <HStack space={3} alignItems="center">
                  <Box
                    bg="secondary.100"
                    p={3}
                    borderRadius={8}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={<MaterialIcons name="restaurant-menu" />} color="secondary.500" size={6} />
                  </Box>
                  <VStack flex={1}>
                    <Heading size="sm" color={textColor}>
                      Nigerian Food Recommendations
                    </Heading>
                    <Text fontSize="xs" color="gray.500">
                      Personalized suggestions based on your goals
                    </Text>
                  </VStack>
                  <Icon as={<Ionicons name="chevron-forward" />} color="gray.400" size={5} />
                </HStack>
              </Card>
            </VStack>
          )}
        </ScrollView>
      </VStack>
    </Box>
  );
};

export default FoodScreen;