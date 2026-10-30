import React, { useState } from 'react';
import {
  Box,
  ScrollView,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  useColorModeValue,
  Icon,
  Button,
  Divider,
  Pressable,
  Switch,
  useColorMode,
} from 'native-base';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/slices/userSlice';
import { useAuth } from '../../context/AuthContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue('white', 'dark.background');
  const cardBgColor = useColorModeValue('white', 'dark.card');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.border', 'dark.border');

  const [isLoading, setIsLoading] = useState(false);

  // Settings menu items
  const settingsMenu = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: 'person',
      iconType: MaterialIcons,
      screen: 'AccountSettings',
      description: 'Manage your profile and personal information',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications',
      iconType: Ionicons,
      screen: 'NotificationSettings',
      description: 'Configure notification preferences',
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: 'palette',
      iconType: MaterialIcons,
      screen: 'AppearanceSettings',
      description: 'Change theme and display settings',
    },
    {
      id: 'health',
      title: 'Health Settings',
      icon: 'heart',
      iconType: FontAwesome5,
      screen: 'HealthSettings',
      description: 'Manage health-related preferences',
    },
    {
      id: 'history',
      title: 'History & Export',
      icon: 'history',
      iconType: MaterialIcons,
      screen: 'History',
      description: 'View and export your health data',
    },
  ];

  // Handle logout
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await dispatch(logoutUser());
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render settings item
  const renderSettingsItem = (item) => (
    <Pressable
      onPress={() => navigation.navigate(item.screen)}
      key={item.id}
    >
      <Card
        bg={cardBgColor}
        borderColor={borderColor}
        borderWidth={1}
        p={4}
        mb={2}
      >
        <HStack space={3} alignItems="center">
          <Box
            bg="primary.100"
            p={2}
            borderRadius={8}
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={item.iconType} name={item.icon} color="primary.500" size={6} />
          </Box>
          <VStack flex={1}>
            <Heading size="sm" color={textColor}>
              {item.title}
            </Heading>
            <Text fontSize="xs" color="gray.500">
              {item.description}
            </Text>
          </VStack>
          <Icon as={<Ionicons name="chevron-forward" />} color="gray.400" size={5} />
        </HStack>
      </Card>
    </Pressable>
  );

  return (
    <Box flex={1} bg={bgColor} safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
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
              Settings
            </Heading>
            <Box w={10} />
          </HStack>

          {/* User Profile Card */}
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
            mb={4}
          >
            <HStack space={3} alignItems="center">
              <Box
                bg="primary.500"
                w={12}
                h={12}
                borderRadius={6}
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={<MaterialIcons name="person" />} color="white" size={8} />
              </Box>
              <VStack flex={1}>
                <Heading size="md" color={textColor}>
                  {user?.profile?.firstName && user.profile.lastName
                    ? `${user.profile.firstName} ${user.profile.lastName}`
                    : user?.email || 'User'}
                </Heading>
                <Text fontSize="xs" color="gray.500">
                  {user?.email}
                </Text>
              </VStack>
              <Button
                size="sm"
                colorScheme="primary"
                variant="outline"
                borderColor={borderColor}
                onPress={() => navigation.navigate('AccountSettings')}
              >
                Edit Profile
              </Button>
            </HStack>
          </Card>

          <Divider my={2} />

          {/* Settings Menu */}
          <Heading size="sm" color={textColor} mb={3}>
            Settings
          </Heading>
          <VStack space={2} mb={4}>
            {settingsMenu.map((item) => renderSettingsItem(item))}
          </VStack>

          <Divider my={4} />

          {/* Theme Toggle */}
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
            mb={4}
          >
            <HStack space={3} alignItems="center" justifyContent="space-between">
              <HStack space={3} alignItems="center">
                <Box
                  bg="secondary.100"
                  p={2}
                  borderRadius={8}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={colorMode === 'dark' ? Ionicons : Ionicons} name={colorMode === 'dark' ? 'moon' : 'sunny'} color="secondary.500" size={6} />
                </Box>
                <VStack>
                  <Heading size="sm" color={textColor}>
                    Dark Mode
                  </Heading>
                  <Text fontSize="xs" color="gray.500">
                    Toggle between light and dark theme
                  </Text>
                </VStack>
              </HStack>
              <Switch
                isChecked={colorMode === 'dark'}
                onToggle={toggleColorMode}
                size="md"
              />
            </HStack>
          </Card>

          <Divider my={4} />

          {/* App Information */}
          <Heading size="sm" color={textColor} mb={3}>
            About
          </Heading>

          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
            mb={2}
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
                  Nigerian Health App
                </Heading>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Version 1.0.0
                </Text>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  A comprehensive health and fitness app tailored for Nigerian users
                </Text>
              </VStack>
            </HStack>
          </Card>

          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth={1}
            p={4}
            mb={4}
          >
            <HStack space={3} alignItems="flex-start">
              <Box
                bg="primary.100"
                p={2}
                borderRadius={8}
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={<MaterialIcons name="help" />} color="primary.500" size={6} />
              </Box>
              <VStack flex={1}>
                <Heading size="sm" color={textColor}>
                  Help & Support
                </Heading>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Need help? Contact our support team
                </Text>
              </VStack>
            </HStack>
          </Card>

          {/* Logout Button */}
          <Button
            colorScheme="red"
            onPress={handleLogout}
            isLoading={isLoading}
            leftIcon={<Icon as={<Ionicons name="log-out" />} size={5} />}
            size="lg"
            py={4}
            mb={10}
          >
            Logout
          </Button>

          {/* Bottom space */}
          <Box h={20} />
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default SettingsScreen;
