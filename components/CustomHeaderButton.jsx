import React from "react";
import { Platform } from "react-native";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../constants/Colors";
import { useTheme } from "@react-navigation/native";


const CustomHeaderButton = (props) => {

  const { colors } = useTheme();

  return (
    <HeaderButton
      {...props}
      IconComponent={props.icon ? props.icon : Ionicons}
      iconSize={props.size?props.size:25}
      color={props.color?props.color: Platform.OS === "android" ? "white" : colors.header}
    />
  );
};

export default CustomHeaderButton;
