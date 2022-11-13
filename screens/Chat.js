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
} from "react-native";
import Colors from "../constants/Colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialIcons } from "@expo/vector-icons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import * as chatActions from "../store/actions/chatActions";

import { JUST_HOST, PORT, HOST } from "../config/server";

import useWebSocket from "react-use-websocket";
import { useDispatch, useSelector } from "react-redux";
import * as conversationActions from "../store/actions/conversationActions";
import * as usersActions from "../store/actions/usersActions";
import { MessageItem } from "../components/MessageItem";

const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 100,
  waitForInteraction: true,
};

export const Chat = (props) => {
  const { conversationName } = props.route.params;
  var user = {
    username: "yaroslav",
    token: "5ac5b2ed8289b986f9bce9864305573ff8595a69",
  };

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [participants, setParticipants] = useState([]);
  const [filesBase64, setFilesBase64] = useState([]);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editedId, setEditedId] = useState("");

  const [isForwarded, setIsForwarded] = useState(false);
  const [forwardConversationName, setForwardConversationName] = useState(null);

  const [param, setParam] = useState(false);

  const [page, setPage] = useState(2);
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [meTyping, setMeTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const timeout = useRef();
  const [query, setQuery] = useState(0);
  const [isReply, setIsReply] = useState(false);
  const [repliedMessageId, setRepliedMessageId] = useState("");
  const flatListRef = useRef();

  const { readyState, sendJsonMessage } = useWebSocket(
    user ? `ws://${JUST_HOST}:${PORT}/chats/${conversationName}/` : null,
    {
      queryParams: {
        token: user ? user.token : "",
      },
      onOpen: () => {
        console.log("Connected!");
      },
      onClose: () => {
        console.log("Disconnected!");
      },
      // New onMessage handler
      onMessage: (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "read_messages":
            if (user?.username != data.user) {
              var oldMessHistory = [...messageHistory];
              oldMessHistory.map((el) => {
                if (!el.read) {
                  el.read = true;
                }
              });
              setMessageHistory(oldMessHistory);
            }
            break;
          case "delete_message":
            setMessageHistory((prev) =>
              prev.filter((el) => el.id !== data.message_id)
            );
            break;

          case "edit_message":
            var oldMessages = [...messageHistory];
            var index = oldMessages.findIndex(
              (el) => el.id === data.message.id
            );
            oldMessages[index] = data.message;
            setMessageHistory([...oldMessages]);
            dispatch(chatActions.editMessage(data));
            break;

          case "message_like":
            var oldMessages = [...messageHistory];
            var index = oldMessages.findIndex(
              (el) => el.id === data.message_id
            );
            var oldMessage = oldMessages[index];
            oldMessage.likes = data.message_likes;
            oldMessages[index] = oldMessage;
            setMessageHistory(oldMessages);
            break;

          case "last_30_messages":
            // var messages = data.messages;
            // for (var i = 0; i < messages.length; i++) {
            //   messages[i].ref = createRef();
            // }
            // setMessageHistory(messages);
            // fetchMessages();
            // setPage(2);
            // setHasMoreMessages(data.has_more);
            break;
          case "all_messages":
            setMessageHistory(data.messages);
            break;
          case "chat_message_echo":
            setMessageHistory((prev) => [data.message, ...prev]);
            sendJsonMessage({ type: "read_messages" });
            break;
          case "read_message_to_change_icon":
            setMessageHistory((prev) =>
              prev.map((item) =>
                item.id === data.message ? data.message : item
              )
            );
            break;
          case "user_join":
            setParticipants((pcpts) => {
              if (!pcpts.includes(data.user)) {
                return [...pcpts, data.user];
              }
              return pcpts;
            });

            break;
          case "user_leave":
            setParticipants((pcpts) => {
              const newPcpts = pcpts.filter((x) => x !== data.user);

              return newPcpts;
            });
            setQuery(Math.random() + Math.random() + Math.random());
            // var oldConversation:ConversationModel = {...conversation}
            // oldConversation.other_user = data.updated_user
            // setConversation({...oldConversation})

            break;
          case "online_user_list":
            setParticipants(data.users);
            break;

          case "typing":
            updateTyping(data);
            break;
          default:
            console.log(data.type);
            console.error("Unknown message type!");
            break;
        }
      },
    }
  );

  const renderItemSeparator = () => <View></View>;

  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator color={"red"} />
      </View>
    ) : (
      renderItemSeparator()
    );
  };
  const getMessageById = (messageId) => {
    return messageHistory.find((el) => el.id === messageId);
  };

  useEffect(() => {
    flatListRef.current.scrollToOffset({ animating: true });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messageHistory}
        // ItemSeparatorComponent={renderItemSeparator}
        keyExtractor={(item) => item.id}
        inverted={true}
        ListFooterComponent={renderFooter}
        // ListHeaderComponent={renderItemSeparator}
        onEndReachedThreshold={0.8}
        // refreshControl={<RefreshControl refreshing={hasMoreMessages} />}
        removeClippedSubviews={false}
        renderItem={(itemData) => (
          <View
            key={Math.random() + Math.random()}
            style={{ marginBottom: 15 }}
          >
            <TouchableOpacity
              onPress={() => {
                flatListRef.current.scrollToOffset({ animating: true });
              }}
            >
              <MessageItem
                item={itemData.item}
                getMessageById={getMessageById}
              ></MessageItem>
            </TouchableOpacity>
          </View>
        )}
        viewabilityConfig={VIEWABILITY_CONFIG}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
