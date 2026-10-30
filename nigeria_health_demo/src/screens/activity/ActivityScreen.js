import React, { useState, useEffect } from 'react';
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
  Divider,
  Pressable,
  Modal,
  FormControl,
  Select,
} from 'native-base';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getActivityLogs, getStepData } from '../../redux/slices/activitySlice';
import { useHealthData } from '../../context/HealthDataContext';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import * as Pedometer from 'expo-sensors';

const screenWidth = Dimensions.get('window').width - 40;

const ActivityScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { activityLogs, stepData, getProgress } = useHealthData();

  const [isAvailable, setIsAvailable] = useState(false);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [duration, setDuration] = useState('30');
  const [intensity, setIntensity] = useState('moderate');
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  // Nigerian activities
  const nigerianActivities = [
    { name: 'Walking', caloriesPerMin: 3.5, category: 'cardio', icon: 'walking' },
    { name: 'Running', caloriesPerMin: 8, category: 'cardio', icon: 'running' },
    { name: 'Cycling', caloriesPerMin: 6, category: 'cardio', icon: 'bicycle' },
    { name: 'Dancing', caloriesPerMin: 5, category: 'cardio', icon: 'dancing' },
    { name: 'Farming', caloriesPerMin: 5, category: 'traditional', icon: 'tractors' },
    { name: 'Swimming', caloriesPerMin: 7, category: 'cardio', icon: 'swimmer' },
    { name: 'Football', caloriesPerMin: 7, category: 'sports', icon: 'futbol' },
    { name: 'Basketball', caloriesPerMin: 6.5, category: 'sports', icon: 'basketball-ball' },
    { name: 'Gym Workout', caloriesPerMin: 6, category: 'strength', icon: 'dumbbell' },
    { name: 'Yoga', caloriesPerMin: 3, category: 'flexibility', icon: 'yoga' },
    { name: 'House Cleaning', caloriesPerMin: 3.5, category: 'daily', icon: 'broom' },
    { name: 'Cooking', caloriesPerMin: 2, category: 'daily', icon: 'utensils' },
  ];

  const intensities = ['low', 'moderate', 'high'];
  const intensityMultipliers = { low: 0.75, moderate: 1, high: 1.5 };

  // Load activity data
  useEffect(() => {
    loadActivityData();
    checkPedometer();
  }, []);

  const loadActivityData = async () => {
    try {
      setIsLoading(true);
      await dispatch(getActivityLogs({ period: 'daily' }));
      await dispatch(getStepData({ period: 'daily' }));
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading activity data:', error);
      setIsLoading(false);
    }
  };

  // Check pedometer availability
  const checkPedometer = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsAvailable(isAvailable);

    if (isAvailable) {
      // Start watching step count
      Pedometer.watchStepCount((result) => {
        setCurrentStepCount(result.steps);
      });
    }
  };

  // Calculate calories burned for selected activity
  const calculateCaloriesBurned = () => {
    if (!selectedActivity || !duration) return 0;

    const durationNum = parseFloat(duration) || 0;
    const multiplier = intensityMultipliers[intensity] || 1;
    
    return Math.round(selectedActivity.caloriesPerMin * durationNum * multiplier);
  };

  // Get today's activity summary
  const todayActivities = activityLogs.filter(
    (log) => moment(log.date).isSame(new Date(), 'day')
  );

  const totalCaloriesBurned = todayActivities.reduce(
    (sum, log) => sum + (log.caloriesBurned || 0),
    0
  );

  const totalSteps = stepData?.steps || currentStepCount || 0;
  const totalActiveMinutes = todayActivities.reduce(
    (sum, log) => sum + (log.duration || 0),
    0
  );

  // Sample data for charts
  const stepsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [5000, 8000, 6000, 10000, 12000, 7000, 9000],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const caloriesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [200, 300, 250, 400, 350, 200, 300],
        color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Handle activity selection
  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
  };

  // Handle add activity
  const handleAddActivity = async () => {
    if (!selectedActivity || !duration) {
      alert('Please select an activity and enter duration');
      return;
    }

    try {
      setIsLoading(true);
      
      // In a real app, we would dispatch an action to log the activity
      // For now, we'll just navigate to the add activity screen
      navigation.navigate('AddActivity', {
        activity: selectedActivity,
        duration: parseFloat(duration),
        intensity,
      });
      
      setIsLoading(false);
      setShowAddModal(false);
      setSelectedActivity(null);
      setDuration('30');
      setIntensity('moderate');
    } catch (error) {
      console.error('Error adding activity:', error);
      setIsLoading(false);
      alert('Error adding activity. Please try again.');
    }
  };

  // Get activity status
  const getActivityStatus = () => {
    const stepGoal = 10000;
    const stepPercentage = Math.min((totalSteps / stepGoal) * 100, 100);

    if (stepPercentage >= 100) {
      return { status: 'complete', message: 'Step goal achieved!', color: 'green.500' };
    } else if (stepPercentage >= 75) {
      return { status: 'good', message: 'Almost there!', color: 'yellow.500' };
    } else if (stepPercentage >= 50) {
      return { status: 'warning', message: 'Keep moving!', color: 'orange.500' };
    } else {
      return { status: 'low', message: 'Get active!', color: 'red.500' };
    }
  };

  const activityStatus = getActivityStatus();

  // Render activity log item
  const renderActivityLog = (log, index) => (
    <HStack
      key={index}
      space={3}
      alignItems="center"
      p={3}
      bg={cardBgColor}
      borderColor={borderColor}
      borderWidth={1}
      borderRadius={8}
      mb={2}
    >
      <Box
        bg="primary.100"
        p={2}
        borderRadius={8}
        alignItems="center"
        justifyContent="center"
      >
        <Icon as={FontAwesome5} name={log.icon || 'running'} color="primary.500" size={6} />
      </Box>
      <VStack flex={1}>
        <Text fontSize="md" fontWeight="bold" color={textColor}>
          {log.name || 'Activity'}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {log.duration || 0} min • {log.caloriesBurned || 0} kcal
        </Text>
      </VStack>
    </HStack>
  );

  return (
    <Box flex={1} bg={bgColor} safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={4} p={4}>
          {/* Header */}
          <HStack alignItems="center" justifyContent="space-between">
            <Heading size="lg" color={textColor}>
              Activity Tracker
            </Heading>
            <Button
              leftIcon={<Icon as={<Ionicons name="add" />} size={5} />}
              colorScheme="primary"
              onPress={() => setShowAddModal(true)}
            >
              Add
            </Button>
          </HStack>

          {/* Steps Summary */}
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
          >
            <VStack space={2}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize="sm" color="gray.500">
                  Today's Steps
                </Text>
                <HStack alignItems="center" space={2}>
                  <Text
                    fontSize="sm"
                    color={activityStatus.color}
                  >
                    {activityStatus.message}
                  </Text>
                  <Icon
                    as={activityStatus.status === 'complete' ? Ionicons : activityStatus.status === 'good' ? Ionicons : activityStatus.status === 'warning' ? Ionicons : Ionicons}
                    name={activityStatus.status === 'complete' ? 'checkmark-circle' : activityStatus.status === 'good' ? 'thumbs-up' : activityStatus.status === 'warning' ? 'alert-circle' : 'warning'}
                    color={activityStatus.color}
                    size={5}
                  />
                </HStack>
              </HStack>
              <HStack alignItems="baseline" space={2}>
                <Heading size="2xl" color={textColor}>
                  {totalSteps.toLocaleString()}
                </Heading>
                <Text fontSize="md" color="gray.500">
                  / 10,000 steps
                </Text>
              </HStack>
              <Progress
                value={Math.min((totalSteps / 10000) * 100, 100)}
                size="sm"
                colorScheme={activityStatus.status === 'complete' ? 'green' : activityStatus.status === 'good' ? 'yellow' : 'red'}
                bg="gray.200"
                borderRadius={5}
                mt={3}
              />
              <HStack justifyContent="space-between" mt={2}>
                <Text fontSize="xs" color="gray.500">
                  {totalCaloriesBurned} kcal burned
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {totalActiveMinutes} min active
                </Text>
              </HStack>
            </VStack>
          </Card>

          {/* Quick Add for Steps */}
          <Heading size="sm" color={textColor} mb={2}>
            Quick Log
          </Heading>
          <HStack space={2} mb={4}>
            <Button
              flex={1}
              leftIcon={<Icon as={<FontAwesome5 name="walking" />} size={5} />}
              colorScheme="primary"
              variant="outline"
              borderColor={borderColor}
              onPress={() => navigation.navigate('StepTracker')}
            >
              Track Steps
            </Button>
            <Button
              flex={1}
              leftIcon={<Icon as={<FontAwesome5 name="running" />} size={5} />}
              colorScheme="primary"
              variant="outline"
              borderColor={borderColor}
              onPress={() => setShowAddModal(true)}
            >
              Log Activity
            </Button>
          </HStack>

          <Divider my={2} />

          {/* Charts */}
          <Heading size="sm" color={textColor} mb={3}>
            This Week
          </Heading>

          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
            mb={4}
          >
            <VStack space={4}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="bold" color={textColor}>
                  Steps
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
                data={stepsData}
                width={screenWidth}
                height={150}
                yAxisLabel="steps"
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
                    stroke: '#4CAF50',
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
            p={4}
            mb={4}
          >
            <VStack space={4}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="bold" color={textColor}>
                  Calories Burned
                </Text>
              </HStack>
              <LineChart
                data={caloriesData}
                width={screenWidth}
                height={150}
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
                    stroke: '#9C27B0',
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

          {/* Today's Activities */}
          <Heading size="sm" color={textColor} mb={3}>
            Today's Activities
          </Heading>
          {todayActivities.length > 0 ? (
            <VStack space={2} mb={10}>
              {todayActivities.map((log, index) => renderActivityLog(log, index))}
            </VStack>
          ) : (
            <Card
              bg={cardBgColor}
              borderColor={borderColor}
              borderWidth={1}
              p={6}
              alignItems="center"
              mb={10}
            >
              <Icon as={<FontAwesome5 name="running" />} size={10} color="gray.400" mb={3} />
              <Text fontSize="md" color="gray.500">
                No activities logged yet
              </Text>
              <Text fontSize="xs" color="gray.400" textAlign="center" mt={1}>
                Start tracking your physical activities
              </Text>
            </Card>
          )}

          {/* Nigerian Activities */}
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
            mb={10}
            onPress={() => navigation.navigate('Exercise')}
          >
            <HStack space={3} alignItems="center">
              <Box
                bg="primary.100"
                p={3}
                borderRadius={8}
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={<FontAwesome5 name="dumbbell" />} color="primary.500" size={6} />
              </Box>
              <VStack flex={1}>
                <Heading size="sm" color={textColor}>
                  Nigerian Activities
                </Heading>
                <Text fontSize="xs" color="gray.500">
                  Traditional and local activities
                </Text>
              </VStack>
              <Icon as={<Ionicons name="chevron-forward" />} color="gray.400" size={5} />
            </HStack>
          </Card>

          {/* Bottom space */}
          <Box h={20} />
        </VStack>
      </ScrollView>

      {/* Add Activity Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        size="full"
      >
        <Modal.Content bg={cardBgColor} flex={1}>
          <Modal.Header borderColor={borderColor}>
            <HStack space={2} alignItems="center">
              <Button
                variant="ghost"
                onPress={() => setShowAddModal(false)}
                leftIcon={<Icon as={<Ionicons name="arrow-back" />} size={5} />}
              >
                Back
              </Button>
              <Heading size="md" color={textColor}>
                Log Activity
              </Heading>
            </HStack>
          </Modal.Header>
          <Modal.Body flex={1}>
            <VStack space={4} flex={1}>
              {/* Activity Selection */}
              <Heading size="sm" color={textColor}>
                Select Activity
              </Heading>
              <VStack space={1} maxH="400">
                {nigerianActivities.map((activity) => (
                  <Pressable
                    key={activity.name}
                    onPress={() => handleActivitySelect(activity)}
                    p={3}
                    bg={selectedActivity?.name === activity.name ? 'primary.100' : cardBgColor}
                    borderColor={borderColor}
                    borderWidth={1}
                    borderRadius={8}
                  >
                    <HStack space={3} alignItems="center">
                      <Box
                        bg={selectedActivity?.name === activity.name ? 'primary.200' : 'primary.100'}
                        p={2}
                        borderRadius={8}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FontAwesome5} name={activity.icon} color="primary.500" size={5} />
                      </Box>
                      <VStack flex={1}>
                        <Text fontSize="md" fontWeight="bold" color={textColor}>
                          {activity.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {activity.category} • {activity.caloriesPerMin} kcal/min
                        </Text>
                      </VStack>
                      {selectedActivity?.name === activity.name && (
                        <Icon as={<Ionicons name="checkmark-circle" />} color="primary.500" size={6} />
                      )}
                    </HStack>
                  </Pressable>
                ))}
              </VStack>

              {/* Duration and Intensity */}
              {selectedActivity && (
                <VStack space={3} mt={4} p={3} bg="gray.50" borderRadius={8}>
                  <Heading size="sm" color={textColor}>
                    Activity Details
                  </Heading>

                  <HStack space={2}>
                    <FormControl flex={1}>
                      <FormControl.Label>
                        <Text fontSize="sm" color={textColor}>
                          Duration (minutes)
                        </Text>
                      </FormControl.Label>
                      <Input
                        value={duration}
                        onChangeText={setDuration}
                        placeholder="30"
                        keyboardType="numeric"
                        borderColor={borderColor}
                        bg={bgColor}
                        color={textColor}
                        placeholderTextColor="gray.400"
                      />
                    </FormControl>

                    <FormControl flex={1}>
                      <FormControl.Label>
                        <Text fontSize="sm" color={textColor}>
                          Intensity
                        </Text>
                      </FormControl.Label>
                      <Select
                        selectedValue={intensity}
                        minWidth="120"
                        accessibilityLabel="Select intensity"
                        placeholder="Select intensity"
                        onValueChange={(itemValue) => setIntensity(itemValue)}
                        borderColor={borderColor}
                        bg={bgColor}
                        _selectedItem={{ bg: 'primary.100' }}
                      >
                        {intensities.map((i) => (
                          <Select.Item key={i} label={i.charAt(0).toUpperCase() + i.slice(1)} value={i} />
                        ))}
                      </Select>
                    </FormControl>
                  </HStack>

                  {/* Estimated Calories */}
                  <Card
                    bg={bgColor}
                    borderColor={borderColor}
                    borderWidth={1}
                    p={3}
                  >
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text fontSize="sm" color={textColor}>
                        Estimated Calories Burned
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color="primary.500">
                        {calculateCaloriesBurned()} kcal
                      </Text>
                    </HStack>
                  </Card>
                </VStack>
              )}
            </VStack>
          </Modal.Body>
          <Modal.Footer borderColor={borderColor}>
            <Button
              variant="ghost"
              colorScheme="gray"
              onPress={() => {
                setShowAddModal(false);
                setSelectedActivity(null);
                setDuration('30');
                setIntensity('moderate');
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="primary"
              onPress={handleAddActivity}
              isLoading={isLoading}
              isDisabled={!selectedActivity || !duration}
            >
              Log Activity
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default ActivityScreen;
