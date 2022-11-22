import React from "react";
import { useSelector } from "react-redux";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
// import ProductNavigator from "../navigation/ProductNavigator";
import Navigation, { AuthNavigator } from "./BaseNavigator";
import Colors from "../constants/Colors";

const BaseAuthNavigator = (props) => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const theme = useSelector((state) => state.theme.themeColors);
  console.log(theme);
  const MyTheme = {
    ...DefaultTheme,
    colors: theme,
  };
  return (
    <NavigationContainer theme={MyTheme}>
      {isAuth && <Navigation />}
      {!isAuth && <AuthNavigator />}
    </NavigationContainer>
  );
};

export default BaseAuthNavigator;
