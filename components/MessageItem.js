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
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatMessageTimestamp } from "../services/TimeServices";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { Octicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import CustomModal from "./CustomModal";
import { FontAwesome } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import { useTheme } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export const MessageItem = (props) => {
  const { colors } = useTheme();

  const user = useSelector((state) => state.auth);

  const [imagePreview, setImagePreview] = useState("");

  const message = props.item;
  const { getMessageById } = props;

  const messageToMe = user.username === message.to_user.username;

  const [messageOptionsOpen, setMessageOptionsOpen] = useState(false);

  return (
    <View
      style={{
        alignItems: messageToMe ? "flex-start" : "flex-end",
        marginLeft: messageToMe ? 7 : 0,
        marginRight: messageToMe ? 0 : 7,
        // marginBottom: 5,
        // marginBottom: 20,
      }}
      ref={message.ref}
    >
      <View>
        <View
          style={{
            // border: "2px solid red",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            borderBottomLeftRadius: 5,
            maxWidth: 250,
            backgroundColor: messageToMe ? colors.messToMe : colors.messFromMe,
            borderWidth:
              messageOptionsOpen ||
              message.scroll ||
              props.editedId === message.id ||
              props.repliedMessageId === message.id
                ? 1.5
                : 0,
            borderColor:
              messageOptionsOpen ||
              message.scroll ||
              props.editedId === message.id ||
              props.repliedMessageId === message.id
                ? colors.read
                : "",
          }}
        >
          {message.forwarded && (
            <View
              style={{
                fontSize: 10,
                marginLeft: 5,
                marginBottom: 2,
                paddingHorizontal: 5,
              }}
            >
              <Text style={{ color: colors.read }}>
                Forwarded from {message.from_user.username}
              </Text>
            </View>
          )}
          {message.parent && (
            <View
              style={{
                // justifyContent: "flex-end",
                padding: 5,
                paddingHorizontal: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  props.scrollToElement(message.parent);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // maxWidth: "90%",
                    // marginLeft: 20,
                    // justifyContent: "flex-start",
                  }}
                >
                  {/* <MaterialCommunityIcons
                  name="drag-vertical-variant"
                  size={24}
                  color="black"
                /> */}
                  <Text
                    style={{
                      fontWeight: "1000",
                      fontSize: 20,
                      marginRight: 5,
                      color: colors.text,
                    }}
                  >
                    |
                  </Text>
                  {getMessageById(message.parent) &&
                  getMessageById(message.parent).content ? (
                    <Text style={{ color: colors.text }}>
                      {getMessageById(message.parent)?.content.length > 15
                        ? `${getMessageById(message.parent)?.content.slice(
                            0,
                            16
                          )}...`
                        : getMessageById(message.parent)?.content}
                    </Text>
                  ) : getMessageById(message.parent) &&
                    getMessageById(message.parent).images ? (
                    <View style={{ flexDirection: "row" }}>
                      {getMessageById(message.parent).images.map((el) => (
                        <View
                          key={el + Math.random()}
                          style={{ width: 30, height: 30, marginRight: 10 }}
                        >
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
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
                  ) : (
                    // <Text>{getMessageById(message.parent).images.length}</Text>
                    <Text style={{ color: colors.text }}>Hidden message</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            onLongPress={() => {
              setMessageOptionsOpen(!messageOptionsOpen);
            }}
            style={{}}
          >
            <View
              style={{
                maxWidth: 220,
                maxHeight: 220,
                flexDirection: "row",
                // flexWrap: "wrap",
                // justifyContent: "space-between",
              }}
            >
              {message.images.map((el) => (
                <View
                  key={el + Math.random()}
                  style={{
                    width:
                      (222 - message.images.length + 1) / message.images.length,
                    height:
                      (220 - message.images.length + 1) / message.images.length,
                  }}
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
                        resizeMode: "cover",
                        // height: "100%",
                        // borderRadius: "50%",
                        // borderRadius: 100,
                      }}
                      onClick={() => {
                        console.log("click");
                      }}
                      source={{
                        uri: el,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            {message.content && (
              <View
                style={{
                  maxWidth: 220,
                  padding: 5,
                  paddingHorizontal: 10,
                  minWidth: 150,
                }}
              >
                <Text style={{ color: colors.text }}>{message.content}</Text>
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                minWidth: 60,
                justifyContent: "flex-end",
                alignItems: "center",
                marginRight: 3,
              }}
            >
              <View
                style={{
                  color: colors.text,
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 5,
                  // fontSize: "0.6rem",
                  // lineHeight: "1rem",
                  // width: "100%",
                }}
              >
                {message.edited && (
                  <Text
                    style={{
                      marginRight: 5,
                      fontSize: 10,
                      color: colors.text,
                    }}
                  >
                    Edited
                  </Text>
                )}
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 12,
                  }}
                >
                  {formatMessageTimestamp(message.timestamp)}
                </Text>
                {user?.username == message.from_user.username && (
                  <View className="read">
                    {message.read ? (
                      <Ionicons
                        name="checkmark-done"
                        size={18}
                        color={colors.read}
                      />
                    ) : (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={colors.read}
                      />
                    )}
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {message.likes.length > 0 && (
          <View
            style={{
              position: "absolute",
              bottom: -12,
              left: 0,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {message.likes.map((el) => (
                <Ionicons
                  key={el + Math.random()}
                  name="heart-sharp"
                  size={18}
                  color="red"
                />
              ))}
            </View>
          </View>
        )}
      </View>
      <View>
        <Modal
          transparent={true}
          visible={messageOptionsOpen}
          animationType="fade"
          onRequestClose={() => setMessageOptionsOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.centeredView]}
            onPressOut={() => setMessageOptionsOpen(false)}
          >
            <TouchableWithoutFeedback style={{ backgroundColor: "red" }}>
              <View
                style={{
                  height: !messageToMe ? 205 : 125,
                  width: 150,
                  borderColor: colors.messageOptionsBorder,
                  backgroundColor: colors.messageOptionsBackground,
                  borderRadius: 10,
                  borderWidth: 1,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    props.replyMessage(message.id);
                    setMessageOptionsOpen(false);
                  }}
                >
                  <View style={styles.messageOptions}>
                    <Octicons
                      name="reply"
                      size={20}
                      color={colors.messageOptionsText}
                    />
                    <Text
                      style={[
                        styles.messageOptionsText,
                        { color: colors.messageOptionsText },
                      ]}
                    >
                      Reply
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    props.likeMessage(message.id);
                    setMessageOptionsOpen(false);
                  }}
                >
                  <View style={styles.messageOptions}>
                    <Ionicons
                      name="heart-outline"
                      size={20}
                      color={colors.messageOptionsText}
                    />
                    <Text
                      style={[
                        styles.messageOptionsText,
                        { color: colors.messageOptionsText },
                      ]}
                    >
                      Like
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    props.forwardMessage(message.id);
                    setMessageOptionsOpen(false);
                  }}
                >
                  <View style={styles.messageOptions}>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color={colors.messageOptionsText}
                    />
                    <Text
                      style={[
                        styles.messageOptionsText,
                        { color: colors.messageOptionsText },
                      ]}
                    >
                      Forward
                    </Text>
                  </View>
                </TouchableOpacity>
                {!messageToMe && (
                  <TouchableOpacity
                    onPress={() => {
                      props.editMessage(message.id);
                      setMessageOptionsOpen(false);
                    }}
                  >
                    <View style={styles.messageOptions}>
                      <MaterialIcons
                        name="edit"
                        size={20}
                        color={colors.messageOptionsText}
                      />
                      <Text
                        style={[
                          styles.messageOptionsText,
                          { color: colors.messageOptionsText },
                        ]}
                      >
                        Edit
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                {!messageToMe && (
                  <TouchableOpacity
                    onPress={() => {
                      props.deleteMessage(message.id);
                      setMessageOptionsOpen(false);
                    }}
                  >
                    <View style={styles.messageOptions}>
                      <MaterialIcons
                        name="delete-outline"
                        size={20}
                        color={colors.messageOptionsText}
                      />
                      <Text
                        style={[
                          styles.messageOptionsText,
                          { color: colors.messageOptionsText },
                        ]}
                      >
                        Delete
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
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
              borderColor: colors.messageOptionsText,
              backgroundColor: colors.messageOptionsBackground,
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
                uri: imagePreview,
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
          </View>
        </CustomModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  messageOptions: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  messageOptionsText: {
    marginLeft: 5,
  },
});
