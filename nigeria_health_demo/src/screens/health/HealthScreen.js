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
} from 'native-base';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getHealthMetrics } from '../../redux/slices/healthSlice';
import { useHealthData } from '../../context/HealthDataContext';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width - 40;

const HealthScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { healthMetrics, getWeightTrend, bmiData, dailyCalorieGoal } = useHealthData();

  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  // Load health data
  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      setIsLoading(true);
      await dispatch(getHealthMetrics({ period: 'recent' }));
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading health data:', error);
      setIsLoading(false);
    }
  };

  const weightTrend = getWeightTrend();

  // Get recent weight measurements
  const recentWeights = healthMetrics
    .filter((m) => m.weight)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 7);

  // Prepare chart data
  const weightData = {
    labels: recentWeights.map((m) => moment(m.date).format('MMM D')),
    datasets: [
      {
        data: recentWeights.map((m) => m.weight),
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Get latest health metrics
  const latestMetrics = healthMetrics.length > 0 ? healthMetrics[0] : null;

  // Calculate weight difference
  const weightDifference = recentWeights.length >= 2
    ? recentWeights[0].weight - recentWeights[recentWeights.length - 1].weight
    : 0;

  // Get progress towards target weight
  const targetWeight = user?.profile?.targetWeight || user?.profile?.currentWeight || 0;
  const currentWeight = latestMetrics?.weight || user?.profile?.currentWeight || 0;
  const weightProgress = targetWeight > 0
    ? Math.round(((currentWeight - user.profile.currentWeight) / (targetWeight - user.profile.currentWeight)) * 100)
    : 0;

  // Render health metric card
  const renderMetricCard = (title, icon, value, subValue, unit, color, trend) => (
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
          {value} {unit}
        </Heading>
        {subValue && (
          <HStack alignItems="center" space={1}>
            <Icon
              as={trend === 'up' ? Ionicons : trend === 'down' ? Ionicons : Ionicons}
              name={trend === 'up' ? 'arrow-up' : trend === 'down' ? 'arrow-down' : 'minus'}
              color={trend === 'up' ? 'green.500' : trend === 'down' ? 'red.500' : 'gray.500'}
              size={4}
            />
            <Text fontSize="xs" color={trend === 'up' ? 'green.500' : trend === 'down' ? 'red.500' : 'gray.500'}>
              {subValue}
            </Text>
          </HStack>
        )}
      </VStack>
    </Card>
  );

  // Render weight history item
  const renderWeightItem = (metric, index) => (
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
        <Icon as={<FontAwesome5 name="weight" />} color="primary.500" size={6} />
      </Box>
      <VStack flex={1}>
        <Text fontSize="md" fontWeight="bold" color={textColor}>
          {metric.weight} kg
        </Text>
        <Text fontSize="xs" color="gray.500">
          {moment(metric.date).format('MMMM D, YYYY')}
        </Text>
      </VStack>
      {metric.bodyFatPercentage && (
        <Text fontSize="xs" color="gray.500">
          {metric.bodyFatPercentage}% fat
        </Text>
      )}
    </HStack>
  );

  return (
    <Box flex={1} bg={bgColor} safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={4} p={4}>
          {/* Header */}
          <HStack alignItems="center" justifyContent="space-between">
            <Heading size="lg" color={textColor}>
              Health Dashboard
            </Heading>
            <Button
              leftIcon={<Icon as={<Ionicons name="settings" />} size={5} />}
              colorScheme="gray"
              variant="ghost"
              onPress={() => navigation.navigate('HealthSettings')}
            >
              Settings
            </Button>
          </HStack>

          {/* BMI and Target Weight */}
          <HStack space={2}>
            <Card
              bg={cardBgColor}
              borderColor={borderColor}
              borderWidth={1}
              flex={1}
            >
              <VStack p={3} space={1}>
                <Text fontSize="xs" color="gray.500">
                  Current Weight
                </Text>
                <Heading size="md" color={textColor}>
                  {currentWeight} kg
                </Heading>
                {weightDifference !== 0 && (
                  <HStack alignItems="center" space={1}>
                    <Icon
                      as={weightDifference > 0 ? Ionicons : Ionicons}
                      name={weightDifference > 0 ? 'arrow-up' : 'arrow-down'}
                      color={weightDifference > 0 ? 'red.500' : 'green.500'}
                      size={4}
                    />
                    <Text fontSize="xs" color={weightDifference > 0 ? 'red.500' : 'green.500'}>
                      {Math.abs(weightDifference).toFixed(1)} kg
                    </Text>
                  </HStack>
                )}
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
                  Target Weight
                </Text>
                <Heading size="md" color={textColor}>
                  {targetWeight} kg
                </Heading>
                <Progress
                  value={weightProgress}
                  size="sm"
                  colorScheme={weightProgress >= 100 ? 'green' : 'primary'}
                  bg="gray.200"
                  borderRadius={5}
                  mt={2}
                />
                <Text
                  fontSize="xs"
                  color={weightProgress >= 100 ? 'green.500' : 'gray.500'}
                  alignSelf="flex-end"
                >
                  {Math.round(weightProgress)}%
                </Text>
              </VStack>
            </Card>
          </HStack>

          {/* BMI Card */}
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
          >
            <HStack space={3} alignItems="center">
              <Box
                bg={bmiData.category === 'Normal weight' ? 'green.100' : 'yellow.100'}
                p={3}
                borderRadius={12}
                alignItems="center"
                justifyContent="center"
              >
                <Icon
                  as={bmiData.category === 'Normal weight' ? MaterialIcons : MaterialIcons}
                  name={bmiData.category === 'Normal weight' ? 'check-circle' : 'warning'}
                  color={bmiData.category === 'Normal weight' ? 'green.500' : 'yellow.500'}
                  size={8}
                />
              </Box>
              <VStack flex={1}>
                <Heading size="md" color={textColor}>
                  BMI: {bmiData.bmi}
                </Heading>
                <Text fontSize="sm" color={bmiData.category === 'Normal weight' ? 'green.500' : 'yellow.500'}>
                  {bmiData.category}
                </Text>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Body Mass Index
                </Text>
              </VStack>
              <Button
                size="sm"
                colorScheme="primary"
                variant="outline"
                borderColor={borderColor}
                onPress={() => navigation.navigate('BodyMeasurement')}
              >
                Update
              </Button>
            </HStack>
          </Card>

          {/* Weight Trend */}
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
          >
            <VStack space={4}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="bold" color={textColor}>
                  Weight Trend
                </Text>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => navigation.navigate('WeightTracker')}
                >
                  View All
                </Button>
              </HStack>
              
              {recentWeights.length > 0 ? (
                <>
                  <LineChart
                    data={weightData}
                    width={screenWidth}
                    height={200}
                    yAxisLabel="kg"
                    yAxisSuffix=""
                    yAxisInterval={1}
                    chartConfig={{
                      backgroundColor: cardBgColor,
                      backgroundGradientFrom: cardBgColor,
                      backgroundGradientTo: cardBgColor,
                      decimalPlaces: 1,
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
                  
                  <HStack justifyContent="space-between" mt={2}>
                    <Text fontSize="xs" color="gray.500">
                      Trend: {weightTrend.trend === 'increasing' ? '↑ Increasing' : weightTrend.trend === 'decreasing' ? '↓ Decreasing' : '→ Stable'}
                    </Text>
                    {weightTrend.change !== 0 && (
                      <Text fontSize="xs" color={weightTrend.trend === 'increasing' ? 'red.500' : 'green.500'}>
                        {weightTrend.change > 0 ? `+${weightTrend.change.toFixed(1)}kg` : `${weightTrend.change.toFixed(1)}kg`}
                      </Text>
                    )}
                  </HStack>
                </>
              ) : (
                <VStack space={4} alignItems="center" py={4}>
                  <Icon as={<FontAwesome5 name="weight" />} size={10} color="gray.400" />
                  <Text fontSize="md" color="gray.500">
                    No weight data yet
                  </Text>
                  <Text fontSize="xs" color="gray.400" textAlign="center">
                    Start tracking your weight to see trends
                  </Text>
                  <Button
                    colorScheme="primary"
                    onPress={() => navigation.navigate('WeightTracker')}
                    mt={2}
                  >
                    Add Weight
                  </Button>
                </VStack>
              )}
            </VStack>
          </Card>

          <Divider my={4} />

          {/* Health Metrics */}
          <Heading size="sm" color={textColor} mb={3}>
            Health Metrics
          </Heading>

          <HStack space={2} mb={4}>
            {renderMetricCard(
              'Calorie Goal',
              MaterialIcons,
              'fire',
              dailyCalorieGoal,
              null,
              'kcal/day',
              'primary.500'
            )}
            {renderMetricCard(
              'Heart Rate',
              FontAwesome5,
              'heartbeat',
              latestMetrics?.heartRate || '--',
              null,
              'bpm',
              'red.500'
            )}
          </HStack>

          <HStack space={2} mb={4}>
            {renderMetricCard(
              'Blood Pressure',
              MaterialIcons,
              'monitor-heart',
              latestMetrics?.bloodPressure?.systolic || '--',
              latestMetrics?.bloodPressure?.diastolic ? `/ ${latestMetrics.bloodPressure.diastolic}` : null,
              'mmHg',
              'blue.500'
            )}
            {renderMetricCard(
              'Body Fat',
              FontAwesome5,
              'percentage',
              latestMetrics?.bodyFatPercentage || '--',
              null,
              '%',
              'purple.500'
            )}
          </HStack>

          <Divider my={4} />

          {/* Quick Actions */}
          <Heading size="sm" color={textColor} mb={3}>
            Quick Actions
          </Heading>

          <HStack space={2} mb={4}>
            <Button
              flex={1}
              leftIcon={<Icon as={<FontAwesome5 name="weight" />} size={5} />}
              colorScheme="primary"
              variant="outline"
              borderColor={borderColor}
              onPress={() => navigation.navigate('WeightTracker')}
            >
              Log Weight
            </Button>
            <Button
              flex={1}
              leftIcon={<Icon as={<MaterialIcons name="straighten" />} size={5} />}
              colorScheme="primary"
              variant="outline"
              borderColor={borderColor}
              onPress={() => navigation.navigate('BodyMeasurement')}
            >
              Measurements
            </Button>
          </HStack>

          <HStack space={2} mb={4}>
            <Button
              flex={1}
              leftIcon={<Icon as={<MaterialIcons name="camera-alt" />} size={5} />}
              colorScheme="secondary"
              variant="outline"
              borderColor={borderColor}
              onPress={() => navigation.navigate('BodyPhoto')}
            >
              Body Photo
            </Button>
            <Button
              flex={1}
              leftIcon={<Icon as={<Ionicons name="settings" />} size={5} />}
              colorScheme="gray"
              variant="outline"
              borderColor={borderColor}
              onPress={() => navigation.navigate('HealthProfile')}
            >
              Health Profile
            </Button>
          </HStack>

          <Divider my={4} />

          {/* Weight History */}
          <Heading size="sm" color={textColor} mb={3}>
            Recent Weight Measurements
          </Heading>
          {recentWeights.length > 0 ? (
            <VStack space={2} mb={10}>
              {recentWeights.map((metric, index) => renderWeightItem(metric, index))}
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
              <Icon as={<FontAwesome5 name="weight" />} size={10} color="gray.400" mb={3} />
              <Text fontSize="md" color="gray.500">
                No weight measurements yet
              </Text>
              <Text fontSize="xs" color="gray.400" textAlign="center" mt={1}>
                Start tracking your weight to monitor progress
              </Text>
            </Card>
          )}

          {/* Tips */}
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
            mb={10}
          >
            <HStack space={3} alignItems="flex-start">
              <Box
                bg="primary.100"
                p={2}
                borderRadius={8}
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={<MaterialIcons name="info" />} color="primary.500" size={6} />
              </Box>
              <VStack flex={1}>
                <Heading size="sm" color={textColor}>
                  Health Tips
                </Heading>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  • Monitor your weight weekly to track progress
                </Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  • Maintain a balanced diet with Nigerian foods
                </Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  • Stay hydrated, especially in hot weather
                </Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  • Combine cardio and strength training for best results
                </Text>
              </VStack>
            </HStack>
          </Card>

          {/* Bottom space */}
          <Box h={20} />
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default HealthScreen;