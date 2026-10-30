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
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width - 40;

const WeeklySummaryScreen = () => {
  const navigation = useNavigation();
  
  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  // Sample weekly data
  const weeklyData = {
    calories: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [2000, 2200, 1800, 2100, 2300, 1900, 2000],
      goal: 2500,
    },
    water: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [2000, 2500, 1800, 2200, 2800, 2000, 2400],
      goal: 2500,
    },
    steps: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [5000, 8000, 6000, 10000, 12000, 7000, 9000],
      goal: 10000,
    },
    weight: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [75.2, 75.1, 75.0, 74.8, 74.7, 74.6, 74.5],
    },
  };

  const chartConfig = {
    backgroundColor: cardBgColor,
    backgroundGradientFrom: cardBgColor,
    backgroundGradientTo: cardBgColor,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
    },
  };

  const renderChart = (title, data, color) => (
    <Card
      bg={cardBgColor}
      borderColor={borderColor}
      borderWidth={1}
      p={4}
      mb={4}
    >
      <VStack space={4}>
        <Heading size="sm" color={textColor}>
          {title}
        </Heading>
        <LineChart
          data={{
            labels: data.labels,
            datasets: [
              {
                data: data.data,
                color: (opacity = 1) => color,
                strokeWidth: 2,
              },
              {
                data: Array(data.labels.length).fill(data.goal || 0),
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                strokeWidth: 1,
              },
            ],
          }}
          width={screenWidth}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </VStack>
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
            Weekly Summary
          </Heading>
          <Box w={10} />
        </HStack>

        {/* Date Range */}
        <Text fontSize="sm" color="gray.500">
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {' '}
          {new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </Text>

        <Divider my={2} />

        {/* Charts */}
        {renderChart('Calorie Intake', weeklyData.calories, 'rgba(76, 175, 80, 1)')}
        {renderChart('Water Intake', weeklyData.water, 'rgba(156, 39, 176, 1)')}
        {renderChart('Steps', weeklyData.steps, 'rgba(0, 150, 255, 1)')}
        {renderChart('Weight', weeklyData.weight, 'rgba(255, 193, 7, 1)')}

        {/* Weekly Stats */}
        <Card
          bg={cardBgColor}
          borderColor={borderColor}
          borderWidth={1}
          p={4}
          mb={10}
        >
          <VStack space={4}>
            <Heading size="sm" color={textColor}>
              Weekly Statistics
            </Heading>
            
            <HStack justifyContent="space-between" py={2}>
              <Text fontSize="sm" color={textColor}>
                Average Calories
              </Text>
              <Text fontSize="sm" fontWeight="bold" color={textColor}>
                {Math.round(weeklyData.calories.data.reduce((a, b) => a + b, 0) / weeklyData.calories.data.length)} kcal
              </Text>
            </HStack>
            
            <HStack justifyContent="space-between" py={2}>
              <Text fontSize="sm" color={textColor}>
                Average Water
              </Text>
              <Text fontSize="sm" fontWeight="bold" color={textColor}>
                {Math.round(weeklyData.water.data.reduce((a, b) => a + b, 0) / weeklyData.water.data.length)} ml
              </Text>
            </HStack>
            
            <HStack justifyContent="space-between" py={2}>
              <Text fontSize="sm" color={textColor}>
                Average Steps
              </Text>
              <Text fontSize="sm" fontWeight="bold" color={textColor}>
                {Math.round(weeklyData.steps.data.reduce((a, b) => a + b, 0) / weeklyData.steps.data.length).toLocaleString()}
              </Text>
            </HStack>
            
            <HStack justifyContent="space-between" py={2}>
              <Text fontSize="sm" color={textColor}>
                Weight Change
              </Text>
              <Text fontSize="sm" fontWeight="bold" color={weeklyData.weight.data[0] > weeklyData.weight.data[6] ? 'red.500' : 'green.500'}>
                {(weeklyData.weight.data[0] - weeklyData.weight.data[6]).toFixed(1)} kg
              </Text>
            </HStack>
          </VStack>
        </Card>

        <Box h={20} />
      </VStack>
    </Box>
  );
};

export default WeeklySummaryScreen;
