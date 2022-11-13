import React from "react";
import { Platform } from "react-native";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../constants/Colors";

const CustomHeaderButton = (props) => {
  return (
    <HeaderButton
      {...props}
      IconComponent={props.icon ? props.icon : Ionicons}
      iconSize={props.size?props.size:25}
      color={Platform.OS === "android" ? "white" : Colors.header}
    />
  );
};

export default CustomHeaderButton;
