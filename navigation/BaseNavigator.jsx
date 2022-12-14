import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Platform, Pressable } from "react-native";
import Registration from "../screens/Auth/Registration";
import { screenOptions as registrationScreenOptions } from "../screens/Auth/Registration";
import { screenOptions as settingsScreenOptions } from "../screens/Settings";

import Ionicons from "react-native-vector-icons/Ionicons";
import Login from "../screens/Auth/Login";
import { screenOptions as loginScreenOptions } from "../screens/Auth/Login";

import Colors from "../constants/Colors";

import { Chat } from "../screens/Chat";
import { screenOptions as chatScreenOption } from "../screens/Chat";

import { Conversations } from "../screens/Conversations";
import { screenOptions as conversationScreenOptions } from "../screens/Conversations";

import { StartConversation } from "../screens/StartConversation";
import { screenOptions as startConversationScreenOptions } from "../screens/StartConversation";

import { UserInfo } from "../screens/UserInfo";
import { screenOptions as userInfoScreenActions } from "../screens/UserInfo";

import { useTheme } from "@react-navigation/native";

import Settings from "../screens/Settings";

import CustomDrawer from "../components/UI/CustomDrawer";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.header : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
};

export default function Navigation() {
  return <DrawerStack />;
}

const Stack = createNativeStackNavigator();

function BaseNavigator() {

  const { colors } = useTheme();

  return (
    <Stack.Navigator screenOptions={[defaultNavOptions, {headerTintColor: colors.text}]}>
      <Stack.Screen
        name="Conversations"
        component={Conversations}
        options={conversationScreenOptions}
      />
      <Stack.Screen name="Chat" component={Chat} options={chatScreenOption} />
      <Stack.Screen name="UserInfo" component={UserInfo} options={userInfoScreenActions} />
      <Stack.Screen
        name="StartConversation"
        component={StartConversation}
        options={startConversationScreenOptions}
      />
    </Stack.Navigator>
  );
}

const AuthStackNavigator = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AuthStackNavigator.Screen
        name="Login"
        component={Login}
        options={loginScreenOptions}
      />
      <AuthStackNavigator.Screen
        name="Registration"
        component={Registration}
        options={registrationScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};

const SettingsStack = createNativeStackNavigator();

function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={defaultNavOptions}>
      <SettingsStack.Screen
        name="Settings"
        component={Settings}
        options={settingsScreenOptions}
      />
    </SettingsStack.Navigator>
  );
}

const Drawer = createDrawerNavigator();

const DrawerStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: Colors.text,
        drawerInactiveTintColor: "grey",
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        label=""
        component={BaseNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
          title: "Chats",
        }}
      />
      <Drawer.Screen
        name="SettingsStackNavigator"
        label=""
        component={SettingsStackNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="md-settings-outline" size={22} color={color} />
          ),
          title: "Settings",
        }}
      />
    </Drawer.Navigator>
  );
};
