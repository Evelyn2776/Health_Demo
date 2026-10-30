import React, { useEffect, useState } from 'react';
import {
  Box,
  ScrollView,
  VStack,
  HStack,
  Text,
  Heading,
  Progress,
  Card,
  useColorModeValue,
  Icon,
  Button,
  Alert,
  Divider,
} from 'native-base';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useHealthData } from '../../context/HealthDataContext';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width - 40;

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { user, isLoading } = useAuth();
  const {
    dailySummary,
    dailyCalorieGoal,
    dailyWaterGoal,
    stepData,
    checkCalorieLimit,
    checkWaterIntake,
    getProgress,
    getWeightTrend,
    bmiData,
    refreshFoodData,
    refreshActivityData,
    refreshWaterData,
  } = useHealthData();

  const [notifications, setNotifications] = useState([]);
  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  // Check for alerts on mount
  useEffect(() => {
    const alerts = [];
    
    // Check calorie alerts
    const calorieAlert = checkCalorieLimit();
    if (calorieAlert.alert) {
      alerts.push({
        type: calorieAlert.type,
        message: calorieAlert.message,
        icon: calorieAlert.type === 'over' ? 'warning' : 'information-circle',
        color: calorieAlert.type === 'over' ? 'red.500' : 'yellow.500',
      });
    }

    // Check water alerts
    const waterAlert = checkWaterIntake();
    if (waterAlert.alert) {
      alerts.push({
        type: waterAlert.type,
        message: waterAlert.message,
        icon: 'tint',
        color: 'blue.500',
      });
    }

    setNotifications(alerts);
  }, [dailySummary, dailyCalorieGoal, dailyWaterGoal]);

  // Refresh data
  useEffect(() => {
    refreshFoodData();
    refreshActivityData();
    refreshWaterData();
  }, []);

  const progress = getProgress();
  const weightTrend = getWeightTrend();

  // Sample data for charts (in a real app, this would come from Redux)
  const calorieData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [2000, 2200, 1800, 2100, 2300, 1900, 2000],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // green
        strokeWidth: 2,
      },
      {
        data: [2500, 2500, 2500, 2500, 2500, 2500, 2500],
        color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`, // purple
        strokeWidth: 2,
      },
    ],
  };

  const waterData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [2000, 2500, 1800, 2200, 2800, 2000, 2400],
        color: (opacity = 1) => `rgba(0, 150, 255, ${opacity})`, // blue
        strokeWidth: 2,
      },
    ],
  };

  const renderNotification = (notification) => (
    <Alert
      status={notification.type === 'over' ? 'error' : notification.type === 'under' ? 'warning' : 'info'}
      colorScheme={notification.type === 'over' ? 'red' : notification.type === 'under' ? 'yellow' : 'blue'}
      mb={3}
    >
      <VStack space={1} flexShrink={1} w="100%">
        <HStack flexShrink={1} space={2} alignItems="center">
          <Alert.Icon />
          <Text fontSize="sm" color="coolGray.800">
            {notification.message}
          </Text>
        </HStack>
      </VStack>
    </Alert>
  );

  const renderProgressCard = (title, icon, value, goal, unit, color, onPress) => {
    const percentage = Math.min((value / goal) * 100, 100);
    const isComplete = percentage >= 100;

    return (
      <Card
        bg={cardBgColor}
        borderColor={borderColor}
        borderWidth={1}
        mb={4}
        onPress={onPress}
      >
        <HStack space={3} alignItems="center" p={4}>
          <Box
            bg={color}
            p={3}
            borderRadius={10}
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={icon} color="white" size={6} />
          </Box>
          <VStack flex={1}>
            <Heading size="sm" color={textColor}>
              {title}
            </Heading>
            <HStack alignItems="center" space={2}>
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                {value} {unit}
              </Text>
              <Text fontSize="xs" color="gray.500">
                of {goal} {unit}
              </Text>
            </HStack>
            <Progress
              value={percentage}
              size="sm"
              colorScheme={isComplete ? 'green' : percentage > 50 ? 'yellow' : 'red'}
              bg="gray.200"
              borderRadius={5}
              mt={2}
            />
            <Text
              fontSize="xs"
              color={isComplete ? 'green.500' : percentage > 50 ? 'yellow.500' : 'red.500'}
              alignSelf="flex-end"
            >
              {Math.round(percentage)}%
            </Text>
          </VStack>
        </HStack>
      </Card>
    );
  };

  const renderStatCard = (title, icon, value, subValue, color) => (
    <Card
      bg={cardBgColor}
      borderColor={borderColor}
      borderWidth={1}
      flex={1}
      mr={2}
    >
      <VStack p={3} space={2}>
        <HStack alignItems="center" space={2}>
          <Box bg={color} p={2} borderRadius={8}>
            <Icon as={icon} color="white" size={5} />
          </Box>
          <Text fontSize="xs" color="gray.500">
            {title}
          </Text>
        </HStack>
        <Heading size="md" color={textColor}>
          {value}
        </Heading>
        {subValue && (
          <Text fontSize="xs" color={subValue.includes('+') ? 'green.500' : subValue.includes('-') ? 'red.500' : 'gray.500'}>
            {subValue}
          </Text>
        )}
      </VStack>
    </Card>
  );

  if (isLoading) {
    return (
      <Box flex={1} bg={bgColor} alignItems="center" justifyContent="center">
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} bg={bgColor} safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <VStack p={4} space={4}>
          <HStack alignItems="center" justifyContent="space-between">
            <VStack>
              <Text fontSize="xs" color="gray.500">
                {moment().format('dddd, MMMM Do YYYY')}
              </Text>
              <Heading size="lg" color={textColor}>
                Welcome back{user?.profile?.firstName ? `, ${user.profile.firstName}` : ''}!
              </Heading>
            </VStack>
            <HStack space={2}>
              <Button
                leftIcon={<Icon as={<Ionicons name="notifications-outline" />} size={5} />}
                variant="ghost"
                colorScheme="gray"
                onPress={() => navigation.navigate('Settings')}
              />
              <Button
                leftIcon={<Icon as={<Ionicons name="settings-outline" />} size={5} />}
                variant="ghost"
                colorScheme="gray"
                onPress={() => navigation.navigate('Settings')}
              />
            </HStack>
          </HStack>

          {/* BMI and Weight Trend */}
          <HStack space={2}>
            <Card
              bg={cardBgColor}
              borderColor={borderColor}
              borderWidth={1}
              flex={1}
            >
              <VStack p={3} space={1}>
                <Text fontSize="xs" color="gray.500">
                  BMI
                </Text>
                <Heading size="md" color={textColor}>
                  {bmiData.bmi}
                </Heading>
                <Text fontSize="xs" color={bmiData.category === 'Normal weight' ? 'green.500' : 'yellow.500'}>
                  {bmiData.category}
                </Text>
              </VStack>
            </Card>
            <Card
              bg={cardBgColor}
              borderColor={borderColor}
              borderWidth={1}
              flex={1}
            >
              <VStack p={3} space={1}>
                <Text fontSize="xs" color="gray.500">
                  Weight Trend
                </Text>
                <Heading size="md" color={textColor}>
                  {weightTrend.trend === 'increasing' ? '↑' : weightTrend.trend === 'decreasing' ? '↓' : '→'}
                </Heading>
                <Text fontSize="xs" color={weightTrend.trend === 'increasing' ? 'red.500' : weightTrend.trend === 'decreasing' ? 'green.500' : 'gray.500'}>
                  {weightTrend.change > 0 ? `+${weightTrend.change.toFixed(1)}kg` : `${weightTrend.change.toFixed(1)}kg`}
                </Text>
              </VStack>
            </Card>
          </HStack>

          {/* Notifications */}
          {notifications.length > 0 && (
            <VStack space={2} mb={4}>
              {notifications.map((notification, index) => (
                <React.Fragment key={index}>
                  {renderNotification(notification)}
                </React.Fragment>
              ))}
            </VStack>
          )}

          {/* Progress Cards */}
          <Heading size="sm" color={textColor} mb={3}>
            Today's Progress
          </Heading>

          {renderProgressCard(
            'Calories',
            MaterialIcons,
            'fire',
            dailySummary.calories,
            dailyCalorieGoal,
            'kcal',
            'primary.500',
            () => navigation.navigate('Food')
          )}

          {renderProgressCard(
            'Water',
            MaterialIcons,
            'local-drink',
            dailySummary.water || 0,
            dailyWaterGoal,
            'ml',
            'secondary.500',
            () => navigation.navigate('Water')
          )}

          {renderProgressCard(
            'Steps',
            FontAwesome5,
            'walking',
            stepData?.steps || 0,
            10000,
            '',
            'green.500',
            () => navigation.navigate('Activity')
          )}

          <Divider my={4} />

          {/* Quick Actions */}
          <Heading size="sm" color={textColor} mb={3}>
            Quick Actions
          </Heading>

          <HStack space={2} mb={4}>
            <Button
              flex={1}
              leftIcon={<Icon as={<MaterialIcons name="add-circle-outline" />} size={5} />}
              colorScheme="primary"
              onPress={() => navigation.navigate('AddFood')}
            >
              Add Food
            </Button>
            <Button
              flex={1}
              leftIcon={<Icon as={<FontAwesome5 name="glass-of-water" />} size={5} />}
              colorScheme="secondary"
              onPress={() => navigation.navigate('AddWater')}
            >
              Add Water
            </Button>
          </HStack>

          <HStack space={2} mb={4}>
            <Button
              flex={1}
              leftIcon={<Icon as={<FontAwesome5 name="running" />} size={5} />}
              colorScheme="green"
              onPress={() => navigation.navigate('AddActivity')}
            >
              Add Activity
            </Button>
            <Button
              flex={1}
              leftIcon={<Icon as={<MaterialIcons name="camera-alt" />} size={5} />}
              colorScheme="purple"
              onPress={() => navigation.navigate('FoodScanner')}
            >
              Scan Food
            </Button>
          </HStack>

          <Divider my={4} />

          {/* Charts */}
          <Heading size="sm" color={textColor} mb={3}>
            This Week
          </Heading>

          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            mb={4}
          >
            <VStack p={4} space={4}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="bold" color={textColor}>
                  Calorie Intake
                </Text>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => navigation.navigate('History')}
                >
                  View More
                </Button>
              </HStack>
              <LineChart
                data={calorieData}
                width={screenWidth}
                height={200}
                yAxisLabel="kcal"
                yAxisSuffix=""
                yAxisInterval={1}
                chartConfig={{
                  backgroundColor: cardBgColor,
                  backgroundGradientFrom: cardBgColor,
                  backgroundGradientTo: cardBgColor,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#ffa726',
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </VStack>
          </Card>

          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            mb={4}
          >
            <VStack p={4} space={4}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="bold" color={textColor}>
                  Water Intake
                </Text>
              </HStack>
              <LineChart
                data={waterData}
                width={screenWidth}
                height={200}
                yAxisLabel="ml"
                yAxisSuffix=""
                yAxisInterval={1}
                chartConfig={{
                  backgroundColor: cardBgColor,
                  backgroundGradientFrom: cardBgColor,
                  backgroundGradientTo: cardBgColor,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#2196f3',
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </VStack>
          </Card>

          <Divider my={4} />

          {/* Recommendations */}
          <Heading size="sm" color={textColor} mb={3}>
            Recommendations
          </Heading>

          <HStack space={2} mb={4}>
            <Card
              bg={cardBgColor}
              borderColor={borderColor}
              borderWidth={1}
              flex={1}
              onPress={() => navigation.navigate('FoodRecommendations')}
            >
              <VStack p={4} space={2} alignItems="center">
                <Box
                  bg="primary.100"
                  p={3}
                  borderRadius={12}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={<MaterialIcons name="restaurant" />} color="primary.500" size={8} />
                </Box>
                <Text fontSize="sm" fontWeight="bold" color={textColor}>
                  Nigerian Foods
                </Text>
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  Based on your goals and preferences
                </Text>
              </VStack>
            </Card>

            <Card
              bg={cardBgColor}
              borderColor={borderColor}
              borderWidth={1}
              flex={1}
              onPress={() => navigation.navigate('ExerciseRecommendations')}
            >
              <VStack p={4} space={2} alignItems="center">
                <Box
                  bg="secondary.100"
                  p={3}
                  borderRadius={12}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={<FontAwesome5 name="dumbbell" />} color="secondary.500" size={8} />
                </Box>
                <Text fontSize="sm" fontWeight="bold" color={textColor}>
                  Exercises
                </Text>
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  Personalized workout suggestions
                </Text>
              </VStack>
            </Card>
          </HStack>

          {/* Bottom space */}
          <Box h={20} />
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default DashboardScreen;
