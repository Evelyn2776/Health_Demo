import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Button,
  useColorModeValue,
  Icon,
} from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate password reset
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <Box flex={1} bg={bgColor} safeArea>
        <VStack space={4} p={4} flex={1} alignItems="center" justifyContent="center">
          <Icon as={<MaterialIcons name="check-circle" />} size={16} color="green.500" />
          <Heading size="xl" color={textColor} textAlign="center">
            Check Your Email
          </Heading>
          <Text fontSize="md" color="gray.500" textAlign="center">
            We've sent a password reset link to {email}
          </Text>
          <Button
            colorScheme="primary"
            onPress={() => navigation.navigate('Login')}
            size="lg"
            py={4}
            mt={8}
          >
            Back to Login
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box flex={1} bg={bgColor} safeArea>
      <VStack space={4} p={4} flex={1}>
        {/* Header */}
        <HStack alignItems="center" justifyContent="space-between">
          <Button
            variant="ghost"
            leftIcon={<Icon as={<Ionicons name="arrow-back" />} size={5} />}
            onPress={() => navigation.goBack()}
          >
            Back
          </Button>
          <Box w={10} />
        </HStack>

        {/* Logo */}
        <VStack alignItems="center" py={8}>
          <Icon as={<MaterialIcons name="lock" />} size={16} color="primary.500" />
          <Heading size="xl" color={textColor} mt={4}>
            Forgot Password?
          </Heading>
          <Text fontSize="md" color="gray.500" textAlign="center">
            Enter your email to reset your password
          </Text>
        </VStack>

        {/* Form */}
        <VStack space={4}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            InputLeftElement={
              <Icon as={<MaterialIcons name="email" />} color="gray.400" size={5} ml={3} />
            }
            borderColor={borderColor}
            bg={cardBgColor}
            color={textColor}
            placeholderTextColor="gray.400"
          />

          <Button
            colorScheme="primary"
            onPress={handleSubmit}
            isLoading={isLoading}
            isDisabled={!email}
            size="lg"
            py={4}
            mt={4}
          >
            Send Reset Link
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default ForgotPasswordScreen;
