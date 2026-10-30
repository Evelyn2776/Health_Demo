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
  Progress,
} from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DailySummaryScreen = () => {
  const navigation = useNavigation();
  
  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  // Sample data
  const dailyData = {
    calories: {
      consumed: 1850,
      goal: 2500,
      percentage: 74,
      remaining: 650,
      status: 'under',
    },
    water: {
      consumed: 1800,
      goal: 2500,
      percentage: 72,
      remaining: 700,
      status: 'under',
    },
    steps: {
      taken: 6500,
      goal: 10000,
      percentage: 65,
      remaining: 3500,
      status: 'under',
    },
    activities: [
      { name: 'Morning Walk', duration: 30, calories: 150 },
      { name: 'Gym Workout', duration: 45, calories: 250 },
    ],
    foods: [
      { name: 'Jollof Rice', calories: 450, mealType: 'lunch' },
      { name: 'Eba with Egusi', calories: 500, mealType: 'dinner' },
      { name: 'Puff Puff', calories: 180, mealType: 'snack' },
    ],
  };

  const renderSummaryCard = (title, icon, value, goal, unit, color) => {
    const percentage = Math.min((value / goal) * 100, 100);
    const status = percentage >= 100 ? 'complete' : percentage >= 75 ? 'good' : 'under';

    return (
      <Card
        bg={cardBgColor}
        borderColor={borderColor}
        borderWidth={1}
        p={4}
        mb={3}
      >
        <VStack space={3}>
          <HStack space={2} alignItems="center">
            <Icon as={icon} color={color} size={6} />
            <Heading size="sm" color={textColor}>
              {title}
            </Heading>
          </HStack>
          <HStack alignItems="baseline" space={2}>
            <Heading size="xl" color={textColor}>
              {value}
            </Heading>
            <Text fontSize="md" color="gray.500">
              / {goal} {unit}
            </Text>
          </HStack>
          <Progress
            value={percentage}
            size="sm"
            colorScheme={status === 'complete' ? 'green' : status === 'good' ? 'yellow' : 'red'}
            bg="gray.200"
            borderRadius={5}
          />
          <Text
            fontSize="xs"
            color={status === 'complete' ? 'green.500' : status === 'good' ? 'yellow.500' : 'red.500'}
            alignSelf="flex-end"
          >
            {Math.round(percentage)}%
          </Text>
        </VStack>
      </Card>
    );
  };

  const renderItem = (title, items) => (
    <Card
      bg={cardBgColor}
      borderColor={borderColor}
      borderWidth={1}
      p={4}
      mb={3}
    >
      <VStack space={2}>
        <Heading size="sm" color={textColor}>
          {title}
        </Heading>
        {items.map((item, index) => (
          <HStack
            key={index}
            space={2}
            alignItems="center"
            p={2}
            bg="gray.100"
            borderRadius={8}
            mb={1}
          >
            <Icon as={MaterialIcons} name="circle" color="primary.500" size={4} />
            <Text fontSize="sm" color={textColor}>
              {item.name}
            </Text>
            {item.calories && (
              <Text fontSize="sm" color="gray.500" ml="auto">
                {item.calories} kcal
              </Text>
            )}
            {item.duration && (
              <Text fontSize="sm" color="gray.500" ml="auto">
                {item.duration} min
              </Text>
            )}
          </HStack>
        ))}
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
            Daily Summary
          </Heading>
          <Box w={10} />
        </HStack>

        {/* Date */}
        <Text fontSize="sm" color="gray.500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>

        <Divider my={2} />

        {/* Summary Cards */}
        {renderSummaryCard(
          'Calories',
          MaterialIcons,
          'fire',
          dailyData.calories.consumed,
          dailyData.calories.goal,
          'kcal',
          'primary.500'
        )}

        {renderSummaryCard(
          'Water',
          MaterialIcons,
          'local-drink',
          dailyData.water.consumed,
          dailyData.water.goal,
          'ml',
          'secondary.500'
        )}

        {renderSummaryCard(
          'Steps',
          MaterialIcons,
          'directions-walk',
          dailyData.steps.taken,
          dailyData.steps.goal,
          '',
          'green.500'
        )}

        <Divider my={4} />

        {/* Activities */}
        {renderItem('Activities', dailyData.activities)}

        {/* Foods */}
        {renderItem('Foods Consumed', dailyData.foods)}

        <Box h={20} />
      </VStack>
    </Box>
  );
};

export default DailySummaryScreen;
