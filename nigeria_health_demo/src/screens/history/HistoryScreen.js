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

const HistoryScreen = () => {
  const navigation = useNavigation();
  
  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

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
            History
          </Heading>
          <Box w={10} />
        </HStack>

        {/* Summary Cards */}
        <HStack space={2}>
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
            flex={1}
            onPress={() => navigation.navigate('DailySummary')}
          >
            <VStack space={2}>
              <Icon as={<MaterialIcons name="today" />} color="primary.500" size={8} />
              <Text fontSize="sm" color="gray.500">
                Today
              </Text>
              <Heading size="md" color={textColor}>
                View Summary
              </Heading>
            </VStack>
          </Card>

          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
            flex={1}
            onPress={() => navigation.navigate('WeeklySummary')}
          >
            <VStack space={2}>
              <Icon as={<MaterialIcons name="calendar-view-week" />} color="secondary.500" size={8} />
              <Text fontSize="sm" color="gray.500">
                This Week
              </Text>
              <Heading size="md" color={textColor}>
                View Summary
              </Heading>
            </VStack>
          </Card>
        </HStack>

        <Divider my={4} />

        {/* History Options */}
        <Heading size="sm" color={textColor} mb={3}>
          View History
        </Heading>

        <VStack space={2}>
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
            onPress={() => navigation.navigate('FoodLog')}
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
                  Food Intake
                </Heading>
                <Text fontSize="xs" color="gray.500">
                  View all logged meals and snacks
                </Text>
              </VStack>
              <Icon as={<Ionicons name="chevron-forward" />} color="gray.400" size={5} />
            </HStack>
          </Card>

          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
          >
            <HStack space={3} alignItems="center">
              <Box
                bg="secondary.100"
                p={2}
                borderRadius={8}
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={<MaterialIcons name="local-drink" />} color="secondary.500" size={6} />
              </Box>
              <VStack flex={1}>
                <Heading size="sm" color={textColor}>
                  Water Intake
                </Heading>
                <Text fontSize="xs" color="gray.500">
                  View all water consumption logs
                </Text>
              </VStack>
              <Icon as={<Ionicons name="chevron-forward" />} color="gray.400" size={5} />
            </HStack>
          </Card>

          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
          >
            <HStack space={3} alignItems="center">
              <Box
                bg="green.100"
                p={2}
                borderRadius={8}
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={<MaterialIcons name="directions-run" />} color="green.500" size={6} />
              </Box>
              <VStack flex={1}>
                <Heading size="sm" color={textColor}>
                  Activity
                </Heading>
                <Text fontSize="xs" color="gray.500">
                  View all physical activities
                </Text>
              </VStack>
              <Icon as={<Ionicons name="chevron-forward" />} color="gray.400" size={5} />
            </HStack>
          </Card>

          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
            onPress={() => navigation.navigate('WeightTracker')}
          >
            <HStack space={3} alignItems="center">
              <Box
                bg="purple.100"
                p={2}
                borderRadius={8}
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={<MaterialIcons name="monitor-weight" />} color="purple.500" size={6} />
              </Box>
              <VStack flex={1}>
                <Heading size="sm" color={textColor}>
                  Weight History
                </Heading>
                <Text fontSize="xs" color="gray.500">
                  View weight measurements over time
                </Text>
              </VStack>
              <Icon as={<Ionicons name="chevron-forward" />} color="gray.400" size={5} />
            </HStack>
          </Card>
        </VStack>

        <Box h={20} />
      </VStack>
    </Box>
  );
};

export default HistoryScreen;
