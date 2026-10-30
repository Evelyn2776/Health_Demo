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
  Input,
} from 'native-base';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logWaterIntake, getWaterData } from '../../redux/slices/waterSlice';
import { useHealthData } from '../../context/HealthDataContext';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width - 40;

const WaterScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { waterData, dailyWaterGoal, refreshWaterData } = useHealthData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [amount, setAmount] = useState('250');
  const [notes, setNotes] = useState('');
  const [waterLogs, setWaterLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  // Load water data
  useEffect(() => {
    loadWaterData();
  }, []);

  const loadWaterData = async () => {
    try {
      setIsLoading(true);
      await dispatch(getWaterData({ period: 'daily' }));
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading water data:', error);
      setIsLoading(false);
    }
  };

  // Update water logs from Redux
  useEffect(() => {
    if (waterData?.entries) {
      setWaterLogs(waterData.entries);
    }
  }, [waterData]);

  // Calculate progress
  const totalIntake = waterData?.totalIntake || 0;
  const percentage = Math.min((totalIntake / dailyWaterGoal) * 100, 100);
  const isComplete = percentage >= 100;

  // Calculate remaining water
  const remainingWater = dailyWaterGoal - totalIntake;

  // Get water intake status
  const getWaterStatus = () => {
    if (percentage >= 100) {
      return { status: 'complete', message: 'Goal achieved!', color: 'green.500' };
    } else if (percentage >= 75) {
      return { status: 'good', message: 'Almost there!', color: 'yellow.500' };
    } else if (percentage >= 50) {
      return { status: 'warning', message: 'Keep drinking!', color: 'orange.500' };
    } else {
      return { status: 'low', message: 'Need more water!', color: 'red.500' };
    }
  };

  const waterStatus = getWaterStatus();

  // Quick add amounts
  const quickAddAmounts = [250, 500, 750, 1000];

  // Handle add water
  const handleAddWater = async () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }

    try {
      setIsLoading(true);
      
      const logData = {
        userId: user.id,
        date: new Date(),
        amount: parseFloat(amount) || 0,
        notes,
      };

      await dispatch(logWaterIntake(logData));
      await refreshWaterData();
      
      // Reset form
      setAmount('250');
      setNotes('');
      setShowAddModal(false);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error logging water:', error);
      setIsLoading(false);
      alert('Error logging water. Please try again.');
    }
  };

  // Handle quick add
  const handleQuickAdd = async (amount) => {
    try {
      setIsLoading(true);
      
      const logData = {
        userId: user.id,
        date: new Date(),
        amount,
        notes: `Quick add: ${amount}ml`,
      };

      await dispatch(logWaterIntake(logData));
      await refreshWaterData();
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error logging water:', error);
      setIsLoading(false);
      alert('Error logging water. Please try again.');
    }
  };

  // Sample data for chart
  const chartData = {
    labels: ['6am', '9am', '12pm', '3pm', '6pm', '9pm'],
    datasets: [
      {
        data: [0, 250, 500, 750, 1000, 1250],
        color: (opacity = 1) => `rgba(0, 150, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Render water log item
  const renderWaterLog = (log, index) => (
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
        bg="secondary.100"
        p={2}
        borderRadius={8}
        alignItems="center"
        justifyContent="center"
      >
        <Icon as={<FontAwesome5 name="glass-of-water" />} color="secondary.500" size={6} />
      </Box>
      <VStack flex={1}>
        <Text fontSize="md" fontWeight="bold" color={textColor}>
          {log.amount}ml
        </Text>
        <Text fontSize="xs" color="gray.500">
          {moment(log.time).format('h:mm a')}
        </Text>
      </VStack>
      {log.notes && (
        <Text fontSize="xs" color="gray.500" numberOfLines={1}>
          {log.notes}
        </Text>
      )}
    </HStack>
  );

  // Calculate next reminder time
  const getNextReminderTime = () => {
    const now = new Date();
    const hours = now.getHours();
    
    // Typical reminder times
    const reminderTimes = [8, 10, 12, 14, 16, 18, 20, 22];
    
    // Find the next reminder time
    const nextTime = reminderTimes.find((time) => time > hours) || reminderTimes[0];
    
    // Format the time
    const nextTimeDate = new Date();
    nextTimeDate.setHours(nextTime, 0, 0, 0);
    
    return nextTimeDate;
  };

  const nextReminderTime = getNextReminderTime();

  return (
    <Box flex={1} bg={bgColor} safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={4} p={4}>
          {/* Header */}
          <HStack alignItems="center" justifyContent="space-between">
            <Heading size="lg" color={textColor}>
              Water Tracker
            </Heading>
            <Button
              leftIcon={<Icon as={<Ionicons name="add" />} size={5} />}
              colorScheme="secondary"
              onPress={() => setShowAddModal(true)}
            >
              Add
            </Button>
          </HStack>

          {/* Water Summary */}
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
          >
            <VStack space={2}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize="sm" color="gray.500">
                  Today's Intake
                </Text>
                <HStack alignItems="center" space={2}>
                  <Text
                    fontSize="sm"
                    color={waterStatus.color}
                  >
                    {waterStatus.message}
                  </Text>
                  <Icon
                    as={waterStatus.status === 'complete' ? Ionicons : waterStatus.status === 'good' ? Ionicons : waterStatus.status === 'warning' ? Ionicons : Ionicons}
                    name={waterStatus.status === 'complete' ? 'checkmark-circle' : waterStatus.status === 'good' ? 'thumbs-up' : waterStatus.status === 'warning' ? 'alert-circle' : 'warning'}
                    color={waterStatus.color}
                    size={5}
                  />
                </HStack>
              </HStack>
              <HStack alignItems="baseline" space={2}>
                <Heading size="2xl" color={textColor}>
                  {totalIntake}
                </Heading>
                <Text fontSize="md" color="gray.500">
                  / {dailyWaterGoal} ml
                </Text>
              </HStack>
              {remainingWater > 0 && (
                <Text fontSize="xs" color="gray.500">
                  {remainingWater}ml remaining
                </Text>
              )}
              {remainingWater <= 0 && (
                <Text fontSize="xs" color="green.500">
                  Goal achieved!
                </Text>
              )}
              
              <Progress
                value={percentage}
                size="sm"
                colorScheme={isComplete ? 'green' : percentage > 50 ? 'yellow' : 'red'}
                bg="gray.200"
                borderRadius={5}
                mt={3}
              />
              <Text
                fontSize="xs"
                color={isComplete ? 'green.500' : percentage > 50 ? 'yellow.500' : 'red.500'}
                alignSelf="flex-end"
              >
                {Math.round(percentage)}%
              </Text>
            </VStack>
          </Card>

          {/* Quick Add */}
          <Heading size="sm" color={textColor} mb={2}>
            Quick Add
          </Heading>
          <HStack space={2} mb={4}>
            {quickAddAmounts.map((amt) => (
              <Button
                key={amt}
                flex={1}
                onPress={() => handleQuickAdd(amt)}
                isLoading={isLoading}
                leftIcon={<Icon as={<FontAwesome5 name="glass-of-water" />} size={4} />}
                colorScheme="secondary"
                variant="outline"
                borderColor={borderColor}
              >
                {amt}ml
              </Button>
            ))}
          </HStack>

          <Divider my={2} />

          {/* Water Chart */}
          <Heading size="sm" color={textColor} mb={3}>
            Intake Over Time
          </Heading>
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
            mb={4}
          >
            <LineChart
              data={chartData}
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
          </Card>

          <Divider my={4} />

          {/* Water Logs */}
          <Heading size="sm" color={textColor} mb={3}>
            Today's Logs
          </Heading>
          {waterLogs.length > 0 ? (
            <VStack space={2} mb={10}>
              {waterLogs.map((log, index) => renderWaterLog(log, index))}
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
              <Icon as={<FontAwesome5 name="glass-of-water" />} size={10} color="gray.400" mb={3} />
              <Text fontSize="md" color="gray.500">
                No water logged yet
              </Text>
              <Text fontSize="xs" color="gray.400" textAlign="center" mt={1}>
                Start tracking your water intake
              </Text>
            </Card>
          )}

          {/* Next Reminder */}
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
            mb={10}
          >
            <HStack space={3} alignItems="center">
              <Box
                bg="secondary.100"
                p={2}
                borderRadius={8}
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={<Ionicons name="notifications" />} color="secondary.500" size={6} />
              </Box>
              <VStack flex={1}>
                <Heading size="sm" color={textColor}>
                  Next Reminder
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  {nextReminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </VStack>
              <Button
                size="sm"
                colorScheme="secondary"
                variant="outline"
                borderColor={borderColor}
                onPress={() => handleQuickAdd(250)}
              >
                Drink Now
              </Button>
            </HStack>
          </Card>

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
                  Water Intake Tips
                </Heading>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  • Drink a glass of water first thing in the morning
                </Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  • Carry a water bottle with you throughout the day
                </Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  • Drink water before meals
                </Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  • In Nigeria's hot climate, increase your intake during the dry season
                </Text>
              </VStack>
            </HStack>
          </Card>

          {/* Bottom space */}
          <Box h={20} />
        </VStack>
      </ScrollView>

      {/* Add Water Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        size="lg"
      >
        <Modal.Content bg={cardBgColor}>
          <Modal.Header borderColor={borderColor}>
            <Heading size="md" color={textColor}>
              Add Water Intake
            </Heading>
          </Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <FormControl isRequired>
                <FormControl.Label>
                  <Text fontSize="sm" color={textColor}>
                    Amount (ml)
                  </Text>
                </FormControl.Label>
                <Input
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="Enter amount in ml"
                  keyboardType="numeric"
                  borderColor={borderColor}
                  bg={bgColor}
                  color={textColor}
                  placeholderTextColor="gray.400"
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>
                  <Text fontSize="sm" color={textColor}>
                    Notes (Optional)
                  </Text>
                </FormControl.Label>
                <Input
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add notes (e.g., before workout)"
                  borderColor={borderColor}
                  bg={bgColor}
                  color={textColor}
                  placeholderTextColor="gray.400"
                />
              </FormControl>

              {/* Quick Amounts */}
              <Text fontSize="sm" color={textColor}>
                Quick Amounts
              </Text>
              <HStack space={1} flexWrap="wrap">
                {quickAddAmounts.map((amt) => (
                  <Button
                    key={amt}
                    size="xs"
                    variant={amount === amt.toString() ? 'solid' : 'outline'}
                    colorScheme={amount === amt.toString() ? 'secondary' : 'gray'}
                    onPress={() => setAmount(amt.toString())}
                    borderColor={borderColor}
                  >
                    {amt}ml
                  </Button>
                ))}
              </HStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer borderColor={borderColor}>
            <Button
              variant="ghost"
              colorScheme="gray"
              onPress={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="secondary"
              onPress={handleAddWater}
              isLoading={isLoading}
              isDisabled={!amount}
            >
              Add Water
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default WaterScreen;
