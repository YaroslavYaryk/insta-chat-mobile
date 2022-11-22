import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import Colors from "../constants/Colors";
import { useTheme } from "@react-navigation/native";

const ChooseConversation = (props) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.conversationBorder,
        padding: 10,
        position: "relative",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ height: 55, width: 55 }}>
          {props.item.image ? (
            <Image
              style={{
                width: "100%",
                height: "100%",
                // borderRadius: "50%",
                borderRadius: 100,
              }}
              source={{
                uri: props.item.image,
              }}
            />
          ) : (
            <Image
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
              }}
              source={require("../assets/man.png")}
            />
          )}
        </View>
        <View style={{ marginLeft: 10 }}>
          <View>
            <Text
              style={{ color: colors.text, fontSize: 17, fontWeight: "600" }}
            >
              {props.item.username}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChooseConversation;
