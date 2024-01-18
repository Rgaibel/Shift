import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Import your screens
import Splash from '../screens/Splash';
import Friend from '../screens/Friend';
import HomeScreen from '../screens/HomeScreen';
import TimeParameterScreen from '../screens/TimeParameterScreen';
import GuardingListFriendsScreen from '../screens/GuardingListFriendsScreen';
import GuardingListEditScreen from '../screens/GuardingListEditScreen';

export type RootStackParamList = {
  Splash: undefined;
  Friend: undefined;
  HomeScreen: undefined;
  TimeParameterScreen: undefined;
  GuardingListFriendsScreen: {
    startDate?: string;
    endDate?: string;
    numCycles?: string;
  };
  GuardingListEditScreen: {
    selectedFriends?: number[];
    startDate?: string;
    endDate?: string;
    numCycles?: string;
  };
};

const NativeStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Define icon components outside the TabNavigator
const HomeIcon: React.FC<{color: string; size: number}> = ({color, size}) => (
  <MaterialCommunityIcons name="home" color={color} size={size} />
);

const FriendsIcon: React.FC<{color: string; size: number}> = ({
  color,
  size,
}) => <MaterialCommunityIcons name="account-group" color={color} size={size} />;

const SettingsIcon: React.FC<{color: string; size: number}> = ({
  color,
  size,
}) => <MaterialCommunityIcons name="cog" color={color} size={size} />;

function StackHomeNavigator() {
  return (
    <NativeStack.Navigator screenOptions={{headerShown: false}}>
      <NativeStack.Screen name="HomeScreen" component={HomeScreen} />
      <NativeStack.Screen
        name="TimeParameterScreen"
        component={TimeParameterScreen}
      />
      <NativeStack.Screen
        name="GuardingListFriendsScreen"
        component={GuardingListFriendsScreen}
      />
      <NativeStack.Screen
        name="GuardingListEditScreen"
        component={GuardingListEditScreen}
      />
    </NativeStack.Navigator>
  );
}

function StackFriendsNavigator() {
  return (
    <NativeStack.Navigator screenOptions={{headerShown: false}}>
      <NativeStack.Screen name="Friend" component={Friend} />
    </NativeStack.Navigator>
  );
}

function StackSettingsNavigator() {
  return (
    <NativeStack.Navigator screenOptions={{headerShown: false}}>
      <NativeStack.Screen name="Splash" component={Splash} />
    </NativeStack.Navigator>
  );
}

function TabNavigator() {
  const tabBarIcon = ({
    route,
    color,
    size,
  }: {
    route: any;
    color: string;
    size: number;
  }): JSX.Element | null => {
    if (route.name === 'Home') {
      return <HomeIcon color={color} size={size} />;
    } else if (route.name === 'Friends') {
      return <FriendsIcon color={color} size={size} />;
    } else if (route.name === 'Settings') {
      return <SettingsIcon color={color} size={size} />;
    }

    // Return a default icon or null if needed
    return null;
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={StackHomeNavigator}
        options={({route}) => ({
          tabBarIcon: ({color, size}) => tabBarIcon({route, color, size}),
        })}
      />
      <Tab.Screen
        name="Friends"
        component={StackFriendsNavigator}
        options={({route}) => ({
          tabBarIcon: ({color, size}) => tabBarIcon({route, color, size}),
        })}
      />
      <Tab.Screen
        name="Settings"
        component={StackSettingsNavigator}
        options={({route}) => ({
          tabBarIcon: ({color, size}) => tabBarIcon({route, color, size}),
        })}
      />
    </Tab.Navigator>
  );
}

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
