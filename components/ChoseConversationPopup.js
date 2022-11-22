import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/Colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialIcons } from "@expo/vector-icons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import { JUST_HOST, PORT } from "../config/server";

import useWebSocket from "react-use-websocket";
import { useDispatch, useSelector } from "react-redux";
import * as conversationActions from "../store/actions/conversationActions";
import * as usersActions from "../store/actions/usersActions";
import { ConversationItem } from "../components/ConversationItem";
import { useTheme } from "@react-navigation/native";

const ChoseConversationPopup = (props) => {
  const { colors } = useTheme();

  const convParticipants = props.conversationName.split("__");

  const user = useSelector((state) => state.auth);
  const otherUser =
    convParticipants[0] == user.username
      ? convParticipants[1]
      : convParticipants[0];

  const conversations = useSelector((state) =>
    state.conversations.conversations.filter(
      (el) => el.other_user.username !== otherUser
    )
  );

  function createConversationName(username) {
    const namesAlph = [user?.username, username].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  if (conversations.length == 0) {
    return (
      <View
        style={[styles.centered, { backgroundColor: colors.backgroundLighter }]}
      >
        <Text style={{ color: colors.text }}>You dont have conversations</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundLighter }]}
    >
      <FlatList
        // onScroll={scrollHandler}
        // ref={ref}
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <View key={Math.random() + Math.random()} style={{ marginBottom: 5 }}>
            <TouchableOpacity
              onPress={() => {
                var username = itemData.item.other_user.username;
                props.handleSelectChat(createConversationName(username));
              }}
            >
              <ConversationItem
                item={itemData.item}
                unreadMessages={[]}
                activeUsers={[]}
                // onSelect={handleSelectChat}
                //  handleEdit={() => {
                //     props.navigation.navigate("EditProject", {
                //        projectId: itemData.item.id,
                //     });
                //  }}
                //  handleDelete={() => {
                //     handleProjectDelete(itemData.item.id);
                //  }}
              ></ConversationItem>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    borderRadius: 20,
    overflow: "hidden",
  },
  centered: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChoseConversationPopup;
