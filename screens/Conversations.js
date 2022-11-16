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

export const Conversations = (props) => {
  const user = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const activeUsers = useSelector((state) => state.users.activeUsers);
  const unreadMessages = useSelector(
    (state) => state.conversations.unreadMessages
  );
  console.log(user);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const dispatch = useDispatch();

  const conversations = useSelector(
    (state) => state.conversations.conversations
  );
  // console.log(conversations.map((el) => el.last_message.content));
  // var ws = new WebSocket(`ws://${JUST_HOST}:${PORT}/conversations/?token=${token}`);
  // ws.onopen = () =>{
  //   console.log("open")
  // }
  // console.log(ws)

  const { readyState, sendJsonMessage } = useWebSocket(
    user ? `ws://${JUST_HOST}:${PORT}/conversations/` : null,
    {
      queryParams: {
        token: user.token ? user.token : null,
      },
      onOpen: () => {
        console.log("Connected!");
      },
      onClose: () => {
        console.log("Disconnected!");
      },
      onMessage: (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "online_user_list":
            dispatch(usersActions.SetActiveUsers(data.users));
            break;
          case "unread_messages":
            // dispatch()
            dispatch(
              conversationActions.addLastUnreadMessageToConversation(data)
            );
            if (data.user === user?.username) {
              dispatch(conversationActions.setUnreadMessaages(data));
              // setUnreadMessages(JSON.parse(data.unread_messages));
            }
            break;
          case "change_last_message":
            // var oldConversations = [...conversations];
            // var index = oldConversations.findIndex(
            //   (el) => el.name === data.name
            // );
            // var oldConversation = oldConversations[index];
            // if (oldConversation) {
            //   oldConversation.last_message = data.message;
            //   oldConversations[index] = oldConversation;
            //   setActiveConversations([...oldConversations]);
            // }
            dispatch(
              conversationActions.addLastUnreadMessageToConversation(data)
            );

            break;
          case "new_unread_message":
            // var oldConversations = [...conversations];
            // var index = oldConversations.findIndex(
            //   (el) => el.name === data.name
            // );
            // var oldConversation = oldConversations[index];
            // if (oldConversation) {
            //   oldConversation.last_message = data.message;
            //   oldConversations[index] = oldConversation;
            //   setActiveConversations([...oldConversations]);
            // }
            dispatch(
              conversationActions.addLastUnreadMessageToConversation(data)
            );
            if (data.from_user == user?.username) {
              break;
            }
            // var oldMessages = [...unreadMessages];
            // const convName = data.name;
            // var index = oldMessages.findIndex((el) => el.name === convName);
            // if (index == -1) {
            //   var newElem = { name: convName, count: 1 };
            //   oldMessages.concat(newElem);
            // } else {
            //   var oldElem = oldMessages[index];
            //   oldElem.count += 1;
            //   oldMessages[index] = oldElem;
            // }
            // setUnreadMessages([...oldMessages]);
            dispatch(conversationActions.addUnreadMessage(data));
            break;
          case "delete_last_unread":
            if (data.from_user == user?.username) {
              break;
            }
            // var oldMessages = [...unreadMessages];
            // const convName = data.name;
            // var index = oldMessages.findIndex((el) => el.name === convName);
            // if (index == -1) {
            //   var newElem = { name: convName, count: 1 };
            //   oldMessages.concat(newElem);
            // } else {
            //   var oldElem = oldMessages[index];
            //   oldElem.count += 1;
            //   oldMessages[index] = oldElem;
            // }
            // setUnreadMessages([...oldMessages]);
            dispatch(conversationActions.deleteUnreadMessage(data));
            break;
          case "user_join":
            dispatch(usersActions.addUserToActive(data.user));
            break;
          case "user_leave":
            dispatch(usersActions.deleteUserFromActive(data.user));

            break;
          default:
            console.log(data.type);
            console.error("Unknown message type!");
            break;
        }
      },
    }
  );

  function createConversationName(username) {
    const namesAlph = [user?.username, username].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  const loadConversations = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(conversationActions.fetchConversations());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setError, setIsLoading]);

  useEffect(() => {
    loadConversations();
  }, [dispatch, loadConversations]);

  const handleSelectChat = (username) => {
    const convName = createConversationName(username);
    props.navigation.navigate("Chat", {
      conversationName: convName,
    });
  };

  if (conversations.length == 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: Colors.text }}>You dont have conversations</Text>
      </View>
    );
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
                handleSelectChat(itemData.item.other_user.username);
              }}
            >
              <ConversationItem
                item={itemData.item}
                unreadMessages={unreadMessages}
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

export const screenOptions = (navData) => {
  var forwardedMessageId = "";
  if (navData.route.params) {
    forwardedMessageId = navData.route.params.forwardedMessageId;
  }

  return {
    headerTitle: forwardedMessageId ? "Forward to..." : "Instachat",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          style={{ marginLeft: -20, padding: 0 }}
          title="search"
          color="red"
          icon={Ionicons}
          size={35}
          iconName={
            Platform.OS === "android"
              ? "reorder-three-sharp"
              : "ios-reorder-three"
          }
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          style={{ marginRight: -20, padding: 0 }}
          title="search"
          color="red"
          icon={Feather}
          size={20}
          iconName={Platform.OS === "android" ? "search" : "search"}
          onPress={() => {}}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
});
