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
  TextInput,
  Dimensions,
  Image,
} from "react-native";
import Colors from "../constants/Colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialIcons } from "@expo/vector-icons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import * as chatActions from "../store/actions/chatActions";
import { FontAwesome5 } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Lightbox from "react-native-lightbox";
import { Octicons } from "@expo/vector-icons";
import { JUST_HOST, PORT, HOST } from "../config/server";

import useWebSocket from "react-use-websocket";
import { useDispatch, useSelector } from "react-redux";
import * as conversationActions from "../store/actions/conversationActions";
import * as usersActions from "../store/actions/usersActions";
import { MessageItem } from "../components/MessageItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import CustomModal from "../components/CustomModal";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

import ChoseConversationPopup from "../components/ChoseConversationPopup";
import { formatMessageTimestamp } from "../services/TimeServices";

const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 100,
  waitForInteraction: true,
};

const { width, height } = Dimensions.get("window");

export const Chat = (props) => {
  const { conversationName } = props.route.params;

  const user = useSelector((state) => state.auth);
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
  const [forwardedMessageId, setForwarderMessageId] = useState(null);

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

  const [imagePreview, setImagePreview] = useState("");

  const { readyState, sendJsonMessage } = useWebSocket(
    user ? `ws://${JUST_HOST}:${PORT}/chats/${conversationName}/` : null,
    {
      queryParams: {
        token: user ? user.token : "",
      },
      onOpen: () => {
        console.log("Connected!");
        sendJsonMessage({ type: "read_messages" });
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
            var messages = data.messages;
            for (var i = 0; i < messages.length; i++) {
              messages[i].ref = createRef();
            }
            setMessageHistory(messages);
            setPage(2);
            setHasMoreMessages(data.has_more);
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
            console.log(participants, data.user);
            setParticipants((pcpts) => {
              if (!pcpts.includes(data.user)) {
                return [...pcpts, data.user];
              }
              return pcpts;
            });

            // setQuery(Math.random() + Math.random() + Math.random());

            break;
          case "user_leave":
            setParticipants((pcpts) => {
              const newPcpts = pcpts.filter((x) => x !== data.user);

              return newPcpts;
            });

            // setQuery(Math.random() + Math.random() + Math.random());
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

  useEffect(() => {
    props.navigation.setParams({
      typing: typing,
    });
  }, [typing]);

  async function fetchMessages() {
    if (!hasMoreMessages) {
      return;
    }
    const apiRes = await fetch(
      `${HOST}:${PORT}/chat/api/messages/?conversation=${conversationName}&page=${page}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    if (apiRes.status === 200) {
      const data = await apiRes.json();
      setHasMoreMessages(data.next !== null);
      setPage(page + 1);
      var messages = data.results;
      for (var i = 0; i < messages.length; i++) {
        messages[i].ref = createRef();
      }
      setMessageHistory((prev) => prev.concat(messages));
    }
  }

  const forwardMessage = (messageId) => {
    // var message = messageHistory.find((el) => el.id === messageId);
    // setMessage(message.content);
    // setFilesBase64(
    //   message.images.map((el) => ({
    //     url: el,
    //     id: Math.random() + Math.random(),
    //   }))
    // );
    setForwarderMessageId(messageId);
    setIsForwarded(!isForwarded);
  };

  const handleChooseUserToForward = (conversationName) => {
    var message = messageHistory.find((el) => el.id === forwardedMessageId);

    setForwardConversationName(conversationName);
    // handleSubmit(conversationName);
    sendJsonMessage({
      type: "chat_message",
      message: message.content,
      filesBase64: message.images.map((el) => ({
        url: el,
        id: Math.random() + Math.random(),
      })),
      parent: repliedMessageId,
      conversation_name: conversationName,
      forwarded: isForwarded,
    });
    makaAllNull();
  };

  useEffect(() => {
    async function fetchConversation() {
      const apiRes = await fetch(
        `${HOST}:${PORT}/chat/api/conversation/${conversationName}/`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${user?.token}`,
          },
        }
      );
      if (apiRes.status === 200) {
        const data = await apiRes.json();
        setConversation(data);
        // try {
        props.navigation.setParams({
          conversation: data,
          participants: participants,
        });
        // } catch (err) {
        //   return;
        // }
      }
    }
    fetchConversation();
  }, [conversationName, query, participants]);

  function updateTyping(event) {
    if (event.user !== user.username) {
      setTyping(event.typing);
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      var images = [];
      for (var i = 0; i < result.assets.length; i++) {
        images.push({
          id: Math.random() + Math.random() + Math.random(),
          url: result.assets[i]
            ? `data:image/jpg;base64,${result.assets[i].base64}`
            : null,
        });
      }
      setFilesBase64([...images]);
    }
  };

  const changeMessageViewOnScroll = (message, mode) => {
    var oldMessages = [...messageHistory];
    var index = oldMessages.findIndex((el) => el.id === message.id);
    var oldMessage = oldMessages[index];
    oldMessage.scroll = mode;
    oldMessages[index] = oldMessage;
    setMessageHistory([...oldMessages]);
  };

  const scrollToElement = (messageId) => {
    var message = messageHistory.find((el) => el.id === messageId);
    changeMessageViewOnScroll(message, true);
    message.ref.current.scrollIntoView({ behavior: "smooth" });
    clearTimeout(timeout.current);
    timeout.current = setTimeout(
      () => changeMessageViewOnScroll(message, false),
      2000
    );
  };

  const getMessageById = (messageId) => {
    return messageHistory.find((el) => el.id === messageId);
  };

  useEffect(() => {
    flatListRef.current.scrollToOffset({ animating: true });
  }, []);

  function timeoutFunction() {
    setMeTyping(false);
    sendJsonMessage({ type: "typing", typing: false });
  }

  const makaAllNull = () => {
    setMessage("");
    setFilesBase64([]);
    clearTimeout(timeout.current);
    timeoutFunction();
    setIsEdit(false);
    setEditedId(null);
    setRepliedMessageId(null);
    setIsReply(false);
    setIsForwarded(false);
    setForwardConversationName(null);
    setForwarderMessageId(null);
  };

  function handleSubmit(conversationName) {
    if (message.length > 0 || filesBase64.length > 0) {
      if (isEdit) {
        sendJsonMessage({
          type: "edit_message",
          messageId: editedId,
          message: message,
          filesBase64: filesBase64,
        });
      } else {
        sendJsonMessage({
          type: "chat_message",
          message,
          filesBase64: filesBase64,
          parent: repliedMessageId,
          conversation_name: conversationName,
          forwarded: isForwarded,
        });
      }
      makaAllNull();
      flatListRef.current.scrollToOffset({ animating: true });
      // setParam(!param);
    }
  }

  const replyMessage = (messageId) => {
    setRepliedMessageId(messageId);
    setIsReply(true);
  };

  const editMessage = (messageId) => {
    setIsEdit(true);
    setEditedId(messageId);
    var message = messageHistory.find((el) => el.id === messageId);
    setMessage(message.content);
    setFilesBase64(
      message.images.map((el) => ({
        url: el,
        id: Math.random() + Math.random(),
      }))
    );
  };

  const likeMessage = (messageId) => {
    var message = messageHistory.find((el) => el.id === messageId);
    const messageLike = message.likes.find((el) => el.user === user?.username);
    if (messageLike) {
      sendJsonMessage({
        type: "delete_message_like",
        messageId,
        user: user?.username,
      });
    } else {
      sendJsonMessage({
        type: "create_message_like",
        messageId,
        user: user?.username,
      });
    }
  };

  const deleteMessage = (messageId) => {
    sendJsonMessage({
      type: "delete_message",
      messageId,
    });
  };

  const clearImage = (id) => {
    // setFfilesBase64();
    setFilesBase64((old) => old.filter((el) => el.id !== id));
  };

  function onType() {
    if (meTyping === false) {
      setMeTyping(true);
      sendJsonMessage({ type: "typing", typing: true });
      timeout.current = setTimeout(timeoutFunction, 5000);
    } else {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(timeoutFunction, 5000);
    }
  }

  function handleChangeMessage(e) {
    setMessage(e);
    onType();
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messageHistory}
        keyExtractor={(item) => item.id}
        inverted={true}
        onEndReached={fetchMessages}
        renderItem={(itemData) => (
          <View
            key={Math.random() + Math.random()}
            style={{ marginBottom: 15 }}
          >
            <MessageItem
              item={itemData.item}
              getMessageById={getMessageById}
              likeMessage={likeMessage}
              deleteMessage={deleteMessage}
              scrollToElement={scrollToElement}
              editMessage={editMessage}
              editedId={editedId}
              replyMessage={replyMessage}
              repliedMessageId={repliedMessageId}
              forwardMessage={forwardMessage}
            ></MessageItem>
          </View>
        )}
        viewabilityConfig={VIEWABILITY_CONFIG}
      />
      {isEdit && (
        <View style={{ padding: 10, backgroundColor: "#2b5278" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="edit" size={20} color="#B2B2B2" />
            <View style={{ marginLeft: 10, width: "85%" }}>
              {getMessageById(editedId).content ? (
                <Text style={{ color: Colors.text }}>
                  {getMessageById(editedId).content}
                </Text>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {getMessageById(editedId).images.map((el) => (
                    <View
                      style={{ height: 40, width: 40 }}
                      key={el + Math.random()}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "center",
                          // borderRadius: "50%",
                          // borderRadius: 100,
                        }}
                        source={{
                          uri: el,
                        }}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
            <FontAwesome5
              name="times"
              size={24}
              color="#B2B2B2"
              style={{ minWidth: 50 }}
              onPress={() => {
                {
                  makaAllNull();
                }
              }}
            />
          </View>
        </View>
      )}
      {isReply && (
        <View style={{ padding: 10, backgroundColor: "#2b5278" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Octicons name="reply" size={20} color="#B2B2B2" />
            <View style={{ marginLeft: 10, width: "85%" }}>
              {getMessageById(repliedMessageId).content ? (
                <Text style={{ color: Colors.text }}>
                  {getMessageById(repliedMessageId).content}
                </Text>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {getMessageById(repliedMessageId).images.map((el) => (
                    <View
                      style={{ height: 40, width: 40 }}
                      key={el + Math.random()}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "center",
                          // borderRadius: "50%",
                          // borderRadius: 100,
                        }}
                        source={{
                          uri: el,
                        }}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
            <FontAwesome5
              name="times"
              size={24}
              color="#B2B2B2"
              style={{ minWidth: 50 }}
              onPress={() => {
                {
                  makaAllNull();
                }
              }}
            />
          </View>
        </View>
      )}
      {filesBase64.length > 0 && (
        <View style={{ borderWidth: 1, borderColor: "#69bbfa", padding: 5 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {filesBase64.map((el) => (
              <View
                key={el + Math.random()}
                style={{ width: 95, height: 95, marginRight: 10 }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setImagePreview(el);
                  }}
                >
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      // borderRadius: "50%",
                      // borderRadius: 100,
                    }}
                    source={{
                      uri: el.url,
                    }}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={{ position: "absolute", top: 0, right: 0 }}>
            <FontAwesome
              name="times-circle-o"
              size={24}
              color="red"
              onPress={() => {
                setFilesBase64([]);
              }}
            />
          </View>
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 5,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
          backgroundColor: "#2E3740",
        }}
      >
        <View style={{ minWidth: 35, alignItems: "center" }}>
          <FontAwesome5 name="smile" size={24} color="#989DA1" />
        </View>
        <View
          style={{
            // marginBottom: 20,
            width: width - 110,
          }}
        >
          <TextInput
            style={{ padding: 5, color: "white" }}
            onChangeText={handleChangeMessage}
            value={message}
            placeholder="Write a message..."
            placeholderTextColor="#989DA1"
          />
        </View>
        {!message && !filesBase64.length > 0 && (
          <View style={{ minWidth: 50, alignItems: "flex-end" }}>
            <SimpleLineIcons
              name="picture"
              size={24}
              color="#989DA1"
              onPress={pickImage}
            />
          </View>
        )}
        {(message || filesBase64.length > 0) && (
          <View style={{ minWidth: 50, alignItems: "flex-end" }}>
            <Ionicons
              name="md-send"
              size={24}
              color="#69bbfa"
              onPress={() => {
                handleSubmit("");
              }}
            />
          </View>
        )}
      </View>

      {imagePreview && (
        <CustomModal
          isOpen={imagePreview}
          close={() => {
            setImagePreview("");
          }}
        >
          <View
            style={{
              height: height,
              width: width,
              borderColor: "#8E8E8E",
              backgroundColor: "rgba(46,55,64,0.95)",
            }}
          >
            <Image
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "center",
                // borderRadius: "50%",
                // borderRadius: 100,
              }}
              source={{
                uri: imagePreview.url,
              }}
            />
            <View style={{ position: "absolute", top: 0, right: 10 }}>
              <FontAwesome
                name="times"
                size={40}
                color="grey"
                onPress={() => {
                  setImagePreview("");
                }}
              />
            </View>
            <View style={{ position: "absolute", top: 0, left: 5 }}>
              <Feather
                name="trash"
                size={40}
                color="grey"
                onPress={() => {
                  clearImage(imagePreview.id);
                  setImagePreview("");
                }}
              />
            </View>
          </View>
        </CustomModal>
      )}
      {isForwarded && (
        <CustomModal
          animType="slide"
          isOpen={isForwarded}
          close={() => {
            makaAllNull();
          }}
        >
          <View
            style={{
              height: height / 1.3,
              width: width / 1.3,
              borderColor: "#8E8E8E",
              backgroundColor: "rgba(46,55,64,0.95)",
              borderRadius: 20,
            }}
          >
            <ChoseConversationPopup
              handleSelectChat={handleChooseUserToForward}
            />
          </View>
        </CustomModal>
      )}
    </View>
  );
};

export const screenOptions = (navData) => {
  const { conversation, participants, typing } = navData.route.params;

  // console.log(navData.route.params);
  return {
    headerTitle: () => (
      <View style={{ marginLeft: -10 }}>
        {conversation ? (
          <TouchableOpacity
            onPress={() => {
              navData.navigation.navigate("UserInfo", {
                username: conversation.other_user.username,
                convName: conversation.name,
              });
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ width: 40, height: 40 }}>
                {conversation.other_user.image ? (
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "cover",
                      // height: "100%",
                      // borderRadius: "50%",
                      borderRadius: 100,
                    }}
                    source={{
                      uri: conversation.other_user.image,
                    }}
                  />
                ) : (
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 100,
                    }}
                    source={require("../assets/man.png")}
                  />
                )}
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: Colors.text,
                  }}
                >
                  {conversation.other_user.username}
                </Text>
                <View>
                  {!participants.includes(conversation.other_user.username) ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {!formatMessageTimestamp(
                        conversation.other_user.last_login,
                        true
                      ) ? (
                        <Text style={[{ marginLeft: 5 }, styles.textHeader]}>
                          {<Text>Last seen recently</Text>}
                        </Text>
                      ) : (
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text style={styles.textHeader}>Seen</Text>
                            {formatMessageTimestamp(
                              conversation.other_user.last_login,
                              true
                            )[3] ? (
                              <Text
                                style={[{ marginLeft: 3 }, styles.textHeader]}
                              >
                                yesterday
                              </Text>
                            ) : formatMessageTimestamp(
                                conversation.other_user.last_login,
                                true
                              )[4] ? (
                              <Text></Text>
                            ) : (
                              <Text
                                style={[{ marginLeft: 3 }, styles.textHeader]}
                              >
                                {
                                  formatMessageTimestamp(
                                    conversation.other_user.last_login,
                                    true
                                  )[2]
                                }
                              </Text>
                            )}
                            <Text
                              style={[styles.textHeader, { marginLeft: 3 }]}
                            >
                              at
                            </Text>
                          </View>
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: "400",
                              color: Colors.text,
                              marginLeft: 3,
                            }}
                          >
                            {
                              formatMessageTimestamp(
                                conversation.other_user.last_login,
                                true
                              )[0]
                            }
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : !typing ? (
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "400",
                        color: Colors.text,
                      }}
                    >
                      Online
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "400",
                        color: Colors.text,
                      }}
                    >
                      Typing...
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View>
            <Text>TEXT</Text>
          </View>
        )}
      </View>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          style={{ marginRight: -20, padding: 0 }}
          title="dots"
          color={Colors.text}
          icon={MaterialCommunityIcons}
          size={26}
          iconName="dots-vertical"
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
  textHeader: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.text,
  },
});
