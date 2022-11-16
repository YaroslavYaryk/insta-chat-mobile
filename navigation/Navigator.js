import React from "react";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
// import ProductNavigator from "../navigation/ProductNavigator";
import Navigation, { AuthNavigator } from "./BaseNavigator";

const BaseAuthNavigator = (props) => {
  const isAuth = useSelector((state) => !!state.auth.token);

  return (
    <NavigationContainer>
      {isAuth && <Navigation />}
      {!isAuth && <AuthNavigator />}
    </NavigationContainer>
  );
};

export default BaseAuthNavigator;
