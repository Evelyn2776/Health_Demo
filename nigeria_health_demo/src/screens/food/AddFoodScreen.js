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
  Pressable,
  Modal,
  FormControl,
  Select,
  Checkbox,
  TextArea,
} from 'native-base';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { searchFoods, addCustomFood, logFoodIntake, clearScannedFood } from '../redux/slices/foodSlice';
import { useHealthData } from '../context/HealthDataContext';
import { useAuth } from '../context/AuthContext';

const AddFoodScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { dailySummary, dailyCalorieGoal, refreshFoodData } = useHealthData();
  const { foods, searchedFoods, isLoading, scannedFood } = useSelector((state) => state.food);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [amount, setAmount] = useState('1');
  const [unit, setUnit] = useState('serving');
  const [mealType, setMealType] = useState('breakfast');
  const [notes, setNotes] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isCustomFood, setIsCustomFood] = useState(false);
  const [customFoodName, setCustomFoodName] = useState('');
  const [customFoodCalories, setCustomFoodCalories] = useState('');
  const [customFoodProtein, setCustomFoodProtein] = useState('');
  const [customFoodCarbs, setCustomFoodCarbs] = useState('');
  const [customFoodFat, setCustomFoodFat] = useState('');

  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  const units = ['serving', 'g', 'kg', 'cup', 'plate', 'wrap', 'piece'];

  // Nigerian portion sizes
  const nigerianPortions = [
    { label: 'Small plate', value: 'small plate' },
    { label: 'Medium plate', value: 'medium plate' },
    { label: 'Large plate', value: 'large plate' },
    { label: '1 wrap', value: 'wrap' },
    { label: '1 cup', value: 'cup' },
    { label: '1 piece', value: 'piece' },
    { label: '1 bowl', value: 'bowl' },
  ];

  // Popular Nigerian foods
  const popularNigerianFoods = [
    { name: 'Jollof Rice', category: 'Rice Dishes', calories: 350, id: 'jollof-rice' },
    { name: 'Eba with Egusi Soup', category: 'Swallow Foods', calories: 450, id: 'eba-egusi' },
    { name: 'Amala with Ewedu', category: 'Swallow Foods', calories: 400, id: 'amala-ewedu' },
    { name: 'Pounded Yam with Vegetable Soup', category: 'Swallow Foods', calories: 380, id: 'pounded-yam' },
    { name: 'Fried Rice', category: 'Rice Dishes', calories: 320, id: 'fried-rice' },
    { name: 'Moi Moi', category: 'Proteins', calories: 220, id: 'moi-moi' },
    { name: 'Puff Puff', category: 'Snacks', calories: 180, id: 'puff-puff' },
    { name: 'Zobo Drink', category: 'Drinks', calories: 50, id: 'zobo' },
  ];

  // Check if we're editing an existing food log
  useEffect(() => {
    if (route.params?.food) {
      setSelectedFood(route.params.food);
      setAmount('1');
      setUnit('serving');
    }
  }, [route.params]);

  // Handle search
  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Search in popular foods
      const filtered = popularNigerianFoods.filter(food =>
        food.name.toLowerCase().includes(query.toLowerCase())
      );
      
      if (filtered.length > 0) {
        setSearchResults(filtered);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Handle food selection
  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setShowSearchModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Calculate nutrition based on amount and unit
  const calculateNutrition = () => {
    if (!selectedFood || !amount) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

    const amountNum = parseFloat(amount) || 1;
    const nutrition = selectedFood.nutritionPer100g || selectedFood.nutrition || {};

    // For demo, assume 1 serving = 100g for simplicity
    const multiplier = unit === 'g' ? amountNum / 100 : amountNum;

    return {
      calories: Math.round((nutrition.calories || 0) * multiplier),
      protein: Math.round((nutrition.protein || 0) * multiplier, 1),
      carbs: Math.round((nutrition.carbohydrates || 0) * multiplier, 1),
      fat: Math.round((nutrition.fat || 0) * multiplier, 1),
    };
  };

  const nutrition = calculateNutrition();

  // Check if form is valid
  const isFormValid = () => {
    if (isCustomFood) {
      return customFoodName && customFoodCalories;
    }
    return selectedFood && amount;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!isFormValid()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const logData = {
        userId: user?.id || 'demo-user',
        date: new Date(),
        mealType,
        items: [
          {
            foodId: isCustomFood ? null : selectedFood.id,
            customFood: isCustomFood
              ? {
                  name: customFoodName,
                  nutrition: {
                    calories: parseFloat(customFoodCalories) || 0,
                    protein: parseFloat(customFoodProtein) || 0,
                    carbohydrates: parseFloat(customFoodCarbs) || 0,
                    fat: parseFloat(customFoodFat) || 0,
                  },
                }
              : null,
            amount: parseFloat(amount) || 1,
            unit,
            calories: nutrition.calories,
            protein: nutrition.protein,
            carbohydrates: nutrition.carbs,
            fat: nutrition.fat,
            notes,
          },
        ],
        totalCalories: nutrition.calories,
        totalProtein: nutrition.protein,
        totalCarbohydrates: nutrition.carbs,
        totalFat: nutrition.fat,
        notes,
      };

      // For demo, just log to console
      console.log('Food logged:', logData);
      
      // Show success message
      alert('Food logged successfully!\n\nCalories: ' + nutrition.calories + '\nProtein: ' + nutrition.protein + 'g\nCarbs: ' + nutrition.carbs + 'g\nFat: ' + nutrition.fat + 'g');
      
      // Reset form
      setSelectedFood(null);
      setAmount('1');
      setUnit('serving');
      setNotes('');
      setIsCustomFood(false);
      setCustomFoodName('');
      setCustomFoodCalories('');
      setCustomFoodProtein('');
      setCustomFoodCarbs('');
      setCustomFoodFat('');

      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error('Error logging food:', error);
      alert('Error logging food. Please try again.');
    }
  };

  // Clear scanned food on unmount
  useEffect(() => {
    return () => {
      dispatch(clearScannedFood());
    };
  }, [dispatch]);

  // Handle scanned food
  useEffect(() => {
    if (scannedFood) {
      setSelectedFood(scannedFood);
      dispatch(clearScannedFood());
    }
  }, [scannedFood, dispatch]);

  // Calculate remaining calories
  const remainingCalories = dailyCalorieGoal - (dailySummary.calories + nutrition.calories);

  return (
    <Box flex={1} bg={bgColor} safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
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
              Add Food
            </Heading>
            <Box w={10} />
          </HStack>

          {/* Food Selection */}
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
          >
            <VStack space={3}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize="sm" fontWeight="bold" color={textColor}>
                  Food
                </Text>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => setShowSearchModal(true)}
                  leftIcon={<Icon as={<Ionicons name="search" />} size={4} />}
                  borderColor={borderColor}
                  _text={{ color: textColor }}
                >
                  {selectedFood ? selectedFood.name : 'Search foods'}
                </Button>
              </HStack>

              {selectedFood && (
                <VStack space={2} p={3} bg="gray.100" borderRadius={8}>
                  <Text fontSize="md" fontWeight="bold" color={textColor}>
                    {selectedFood.name}
                  </Text>
                  {selectedFood.category && (
                    <Text fontSize="xs" color="gray.500">
                      Category: {selectedFood.category}
                    </Text>
                  )}
                  <Text fontSize="xs" color="gray.600">
                    Calories: {selectedFood.nutritionPer100g?.calories || selectedFood.calories || 0} per serving
                  </Text>
                </VStack>
              )}

              <Checkbox
                value="custom"
                isChecked={isCustomFood}
                onChange={(isChecked) => {
                  setIsCustomFood(isChecked);
                  if (!isChecked) {
                    setSelectedFood(null);
                  }
                }}
                my={2}
              >
                <Text ml={2} fontSize="sm" color={textColor}>
                  Add custom food
                </Text>
              </Checkbox>

              {/* Custom Food Fields */}
              {isCustomFood && (
                <VStack space={3} mt={3} p={3} bg="gray.50" borderRadius={8}>
                  <FormControl isRequired>
                    <FormControl.Label>
                      <Text fontSize="sm" color={textColor}>
                        Food Name
                      </Text>
                    </FormControl.Label>
                    <Input
                      value={customFoodName}
                      onChangeText={setCustomFoodName}
                      placeholder="Enter food name"
                      borderColor={borderColor}
                      bg={cardBgColor}
                      color={textColor}
                      placeholderTextColor="gray.400"
                    />
                  </FormControl>

                  <HStack space={2}>
                    <FormControl isRequired flex={1}>
                      <FormControl.Label>
                        <Text fontSize="sm" color={textColor}>
                          Calories (per serving)
                        </Text>
                      </FormControl.Label>
                      <Input
                        value={customFoodCalories}
                        onChangeText={setCustomFoodCalories}
                        placeholder="0"
                        keyboardType="numeric"
                        borderColor={borderColor}
                        bg={cardBgColor}
                        color={textColor}
                        placeholderTextColor="gray.400"
                      />
                    </FormControl>

                    <FormControl flex={1}>
                      <FormControl.Label>
                        <Text fontSize="sm" color={textColor}>
                          Protein (g)
                        </Text>
                      </FormControl.Label>
                      <Input
                        value={customFoodProtein}
                        onChangeText={setCustomFoodProtein}
                        placeholder="0"
                        keyboardType="numeric"
                        borderColor={borderColor}
                        bg={cardBgColor}
                        color={textColor}
                        placeholderTextColor="gray.400"
                      />
                    </FormControl>
                  </HStack>

                  <HStack space={2}>
                    <FormControl flex={1}>
                      <FormControl.Label>
                        <Text fontSize="sm" color={textColor}>
                          Carbs (g)
                        </Text>
                      </FormControl.Label>
                      <Input
                        value={customFoodCarbs}
                        onChangeText={setCustomFoodCarbs}
                        placeholder="0"
                        keyboardType="numeric"
                        borderColor={borderColor}
                        bg={cardBgColor}
                        color={textColor}
                        placeholderTextColor="gray.400"
                      />
                    </FormControl>

                    <FormControl flex={1}>
                      <FormControl.Label>
                        <Text fontSize="sm" color={textColor}>
                          Fat (g)
                        </Text>
                      </FormControl.Label>
                      <Input
                        value={customFoodFat}
                        onChangeText={setCustomFoodFat}
                        placeholder="0"
                        keyboardType="numeric"
                        borderColor={borderColor}
                        bg={cardBgColor}
                        color={textColor}
                        placeholderTextColor="gray.400"
                      />
                    </FormControl>
                  </HStack>
                </VStack>
              )}
            </VStack>
          </Card>

          {/* Amount and Unit */}
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
          >
            <VStack space={3}>
              <Text fontSize="sm" fontWeight="bold" color={textColor}>
                Portion Size
              </Text>
              
              <HStack space={2}>
                <FormControl flex={1}>
                  <FormControl.Label>
                    <Text fontSize="sm" color={textColor}>
                      Amount
                    </Text>
                  </FormControl.Label>
                  <Input
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="1"
                    keyboardType="numeric"
                    borderColor={borderColor}
                    bg={cardBgColor}
                    color={textColor}
                    placeholderTextColor="gray.400"
                  />
                </FormControl>

                <FormControl flex={1}>
                  <FormControl.Label>
                    <Text fontSize="sm" color={textColor}>
                      Unit
                    </Text>
                  </FormControl.Label>
                  <Select
                    selectedValue={unit}
                    minWidth="120"
                    accessibilityLabel="Select unit"
                    placeholder="Select unit"
                    onValueChange={(itemValue) => setUnit(itemValue)}
                    borderColor={borderColor}
                    bg={cardBgColor}
                    _selectedItem={{ bg: 'primary.100' }}
                  >
                    {units.map((u) => (
                      <Select.Item key={u} label={u} value={u} />
                    ))}
                  </Select>
                </FormControl>
              </HStack>

              {/* Nigerian Portion Sizes */}
              <Text fontSize="xs" color="gray.500" mt={2}>
                Nigerian portion sizes:
              </Text>
              <HStack flexWrap="wrap" space={1}>
                {nigerianPortions.map((portion) => (
                  <Button
                    key={portion.value}
                    size="xs"
                    variant={unit === portion.value ? 'solid' : 'outline'}
                    colorScheme={unit === portion.value ? 'primary' : 'gray'}
                    onPress={() => setUnit(portion.value)}
                    borderColor={borderColor}
                    _text={{ fontSize: 'xs' }}
                  >
                    {portion.label}
                  </Button>
                ))}
              </HStack>
            </VStack>
          </Card>

          {/* Meal Type */}
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
          >
            <VStack space={3}>
              <Text fontSize="sm" fontWeight="bold" color={textColor}>
                Meal Type
              </Text>
              <HStack space={1} flexWrap="wrap">
                {mealTypes.map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={mealType === type ? 'solid' : 'outline'}
                    colorScheme={mealType === type ? 'primary' : 'gray'}
                    onPress={() => setMealType(type)}
                    borderColor={borderColor}
                    leftIcon={
                      type === 'breakfast' ? (
                        <Icon as={<MaterialIcons name="breakfast-dining" />} size={4} />
                      ) : type === 'lunch' ? (
                        <Icon as={<MaterialIcons name="lunch-dining" />} size={4} />
                      ) : type === 'dinner' ? (
                        <Icon as={<MaterialIcons name="dinner-dining" />} size={4} />
                      ) : (
                        <Icon as={<MaterialIcons name="coffee" />} size={4} />
                      )
                    }
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </HStack>
            </VStack>
          </Card>

          {/* Notes */}
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
          >
            <VStack space={3}>
              <Text fontSize="sm" fontWeight="bold" color={textColor}>
                Notes (Optional)
              </Text>
              <TextArea
                h={20}
                placeholder="Add any notes about this meal..."
                value={notes}
                onChangeText={setNotes}
                borderColor={borderColor}
                bg={cardBgColor}
                color={textColor}
                placeholderTextColor="gray.400"
              />
            </VStack>
          </Card>

          {/* Nutrition Summary */}
          {selectedFood && (
            <Card
              bg={cardBgColor}
              borderColor={borderColor}
              borderWidth={1}
              p={4}
            >
              <VStack space={3}>
                <Text fontSize="sm" fontWeight="bold" color={textColor}>
                  Estimated Nutrition
                </Text>
                <Divider my={2} />
                <HStack justifyContent="space-between" py={1}>
                  <Text fontSize="sm" color={textColor}>
                    Calories
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color={textColor}>
                    {nutrition.calories} kcal
                  </Text>
                </HStack>
                <HStack justifyContent="space-between" py={1}>
                  <Text fontSize="sm" color={textColor}>
                    Protein
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color={textColor}>
                    {nutrition.protein}g
                  </Text>
                </HStack>
                <HStack justifyContent="space-between" py={1}>
                  <Text fontSize="sm" color={textColor}>
                    Carbohydrates
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color={textColor}>
                    {nutrition.carbs}g
                  </Text>
                </HStack>
                <HStack justifyContent="space-between" py={1}>
                  <Text fontSize="sm" color={textColor}>
                    Fat
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color={textColor}>
                    {nutrition.fat}g
                  </Text>
                </HStack>
                <Divider my={2} />
                <HStack justifyContent="space-between" py={1}>
                  <Text fontSize="sm" color={textColor}>
                    Total Today (after adding)
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color={remainingCalories < 0 ? 'red.500' : textColor}>
                    {dailySummary.calories + nutrition.calories} / {dailyCalorieGoal} kcal
                  </Text>
                </HStack>
                {remainingCalories < 0 && (
                  <Text fontSize="xs" color="red.500" textAlign="right">
                    {Math.abs(remainingCalories)} calories over limit
                  </Text>
                )}
              </VStack>
            </Card>
          )}

          {/* Submit Button */}
          <Button
            colorScheme="primary"
            onPress={handleSubmit}
            isLoading={isLoading}
            isDisabled={!isFormValid()}
            size="lg"
            py={4}
            mb={10}
          >
            Log Food
          </Button>
        </VStack>
      </ScrollView>

      {/* Food Search Modal */}
      <Modal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        size="full"
      >
        <Modal.Content bg={cardBgColor} flex={1}>
          <Modal.Header borderColor={borderColor}>
            <HStack space={2} alignItems="center">
              <Button
                variant="ghost"
                onPress={() => setShowSearchModal(false)}
                leftIcon={<Icon as={<Ionicons name="arrow-back" />} size={5} />}
              >
                Back
              </Button>
              <Input
                flex={1}
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
                borderColor={borderColor}
                bg={bgColor}
                color={textColor}
                placeholderTextColor="gray.400"
              />
            </HStack>
          </Modal.Header>
          <Modal.Body flex={1}>
            <VStack space={2} flex={1}>
              {searchQuery.length > 0 && searchResults.length === 0 && (
                <Text textAlign="center" color="gray.500" py={4}>
                  No results found
                </Text>
              )}
              <VStack space={2}>
                {searchQuery.length > 0 ? (
                  searchResults.map((food) => (
                    <Pressable
                      key={food.id || food.name}
                      onPress={() => handleFoodSelect(food)}
                      p={3}
                      borderBottomWidth={1}
                      borderBottomColor={borderColor}
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
                          <Text fontSize="md" color={textColor}>
                            {food.name}
                          </Text>
                          {food.category && (
                            <Text fontSize="xs" color="gray.500">
                              {food.category}
                            </Text>
                          )}
                        </VStack>
                      </HStack>
                    </Pressable>
                  ))
                ) : (
                  popularNigerianFoods.map((food) => (
                    <Pressable
                      key={food.id || food.name}
                      onPress={() => handleFoodSelect(food)}
                      p={3}
                      borderBottomWidth={1}
                      borderBottomColor={borderColor}
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
                          <Text fontSize="md" color={textColor}>
                            {food.name}
                          </Text>
                          {food.category && (
                            <Text fontSize="xs" color="gray.500">
                              {food.category}
                            </Text>
                          )}
                        </VStack>
                      </HStack>
                    </Pressable>
                  ))
                )}
              </VStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default AddFoodScreen;
