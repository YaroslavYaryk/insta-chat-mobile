import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Platform, Pressable } from "react-native";

import Colors from "../constants/Colors";

import { Chat } from "../screens/Chat";
import { Conversations } from "../screens/Conversations";
import {screenOptions as conversationScreenOptions} from '../screens/Conversations'

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
  headerTintColor: Platform.OS === "android" ? "white" : Colors.text,
};

export default function Navigation() {
  return (
    <NavigationContainer>
      <BaseNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();

function BaseNavigator() {
  return (
    <Stack.Navigator screenOptions={defaultNavOptions}>
      <Stack.Screen
        name="Conversations"
        component={Conversations}
        options={conversationScreenOptions }
      />
      <Stack.Screen name="Chat" component={Chat} options={{ title: "Oops!" }} />
    </Stack.Navigator>
  );
}
