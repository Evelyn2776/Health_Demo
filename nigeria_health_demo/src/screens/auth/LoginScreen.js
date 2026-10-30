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

const LoginScreen = () => {
  const navigation = useNavigation();
  const { demoLogin } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await demoLogin();
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
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
        <VStack alignItems="center" py={8}>
          <Icon as={<MaterialIcons name="health-and-safety" />} size={16} color="primary.500" />
          <Heading size="xl" color={textColor} mt={4}>
            Welcome Back
          </Heading>
          <Text fontSize="md" color="gray.500">
            Sign in to continue
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
            onPress={handleLogin}
            isLoading={isLoading}
            isDisabled={!email || !password}
            size="lg"
            py={4}
            mt={4}
          >
            Sign In
          </Button>

          {/* Demo Login */}
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
            Demo Login (Try Without Account)
          </Button>

          {/* Links */}
          <HStack justifyContent="center" space={4} mt={4}>
            <Link onPress={() => navigation.navigate('ForgotPassword')}>
              <Text fontSize="sm" color="primary.500">
                Forgot Password?
              </Text>
            </Link>
            <Link onPress={() => navigation.navigate('Register')}>
              <Text fontSize="sm" color="primary.500">
                Create Account
              </Text>
            </Link>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default LoginScreen;
