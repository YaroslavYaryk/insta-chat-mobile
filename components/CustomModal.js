import React, {
  useEffect,
  useCallback,
  useState,
  useRef,
  createRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  Button,
  TouchableWithoutFeedback,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatMessageTimestamp } from "../services/TimeServices";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { Octicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const CustomModal = (props) => {
  return (
    <View>
      <Modal
        transparent={true}
        // visible={props.isOpen}
        animationType={props.anymType ? props.anymType : "fade"}
        onRequestClose={() => props.close()}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.centeredView]}
          onPressOut={() => props.close()}
        >
          <TouchableWithoutFeedback style={{ backgroundColor: "red" }}>
            {props.children}
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  textHeader: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.text,
  },
});
