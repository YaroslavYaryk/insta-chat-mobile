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

const ChoseConversationPopup = (props) => {
  var user = {
    username: "yaroslav",
    token: "5ac5b2ed8289b986f9bce9864305573ff8595a69",
  };
  const conversations = useSelector(
    (state) => state.conversations.conversations
  );

  function createConversationName(username) {
    const namesAlph = [user?.username, username].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  return (
    <View style={[styles.container, {}]}>
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
    backgroundColor: Colors.backgroundLighter,
    borderRadius: 20,
    overflow: "hidden",
  },
});

export default ChoseConversationPopup;
