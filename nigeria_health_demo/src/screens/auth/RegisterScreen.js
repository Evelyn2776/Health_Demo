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
  Link,
} from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { demoLogin } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      // In demo mode, just login with demo account
      await demoLogin();
      navigation.navigate('ProfileSetup');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
        <VStack alignItems="center" py={4}>
          <Icon as={<MaterialIcons name="person-add" />} size={16} color="primary.500" />
          <Heading size="xl" color={textColor} mt={4}>
            Create Account
          </Heading>
          <Text fontSize="md" color="gray.500">
            Join the Nigerian Health community
          </Text>
        </VStack>

        {/* Form */}
        <VStack space={4}>
          <HStack space={2}>
            <Input
              flex={1}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              InputLeftElement={
                <Icon as={<MaterialIcons name="person" />} color="gray.400" size={5} ml={3} />
              }
              borderColor={borderColor}
              bg={cardBgColor}
              color={textColor}
              placeholderTextColor="gray.400"
            />
            <Input
              flex={1}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              InputLeftElement={
                <Icon as={<MaterialIcons name="person" />} color="gray.400" size={5} ml={3} />
              }
              borderColor={borderColor}
              bg={cardBgColor}
              color={textColor}
              placeholderTextColor="gray.400"
            />
          </HStack>

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

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            InputLeftElement={
              <Icon as={<MaterialIcons name="lock" />} color="gray.400" size={5} ml={3} />
            }
            borderColor={borderColor}
            bg={cardBgColor}
            color={textColor}
            placeholderTextColor="gray.400"
          />

          <Button
            colorScheme="primary"
            onPress={handleRegister}
            isLoading={isLoading}
            isDisabled={!email || !password || !firstName}
            size="lg"
            py={4}
            mt={4}
          >
            Create Account
          </Button>

          {/* Demo Register */}
          <Button
            colorScheme="secondary"
            onPress={async () => {
              setIsLoading(true);
              await demoLogin();
              navigation.navigate('Dashboard');
              setIsLoading(false);
            }}
            isLoading={isLoading}
            variant="outline"
            size="lg"
            py={4}
          >
            Demo Account (Try Without Registering)
          </Button>

          {/* Link to Login */}
          <HStack justifyContent="center" mt={4}>
            <Text fontSize="sm" color="gray.500">
              Already have an account?
            </Text>
            <Link onPress={() => navigation.navigate('Login')}>
              <Text fontSize="sm" color="primary.500" ml={1}>
                Sign In
              </Text>
            </Link>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default RegisterScreen;
