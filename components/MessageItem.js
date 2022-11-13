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
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatMessageTimestamp } from "../services/TimeServices";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

export const MessageItem = (props) => {
  var user = {
    username: "yaroslav",
    token: "5ac5b2ed8289b986f9bce9864305573ff8595a69",
  };

  const message = props.item;
  const { getMessageById } = props;

  const messageToMe = user.username === message.to_user.username;
  return (
    <View
      style={{
        alignItems: messageToMe ? "flex-start" : "flex-end",
        marginLeft: messageToMe ? 7 : 0,
        marginRight: messageToMe ? 0 : 7,
        // marginBottom: 5,
        // marginBottom: 20,
      }}
    >
      <View>
        <View
          style={{
            // border: "2px solid red",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            borderBottomLeftRadius: 5,
            maxWidth: 250,
            backgroundColor: messageToMe ? "#1f374a" : "#2b5278",
            borderColor: message.scroll ? "grey" : "",
          }}
        >
          {message.forwarded && (
            <View
              style={{
                fontSize: 10,
                marginLeft: 5,
                marginBottom: -5,
                paddingHorizontal: 5,
              }}
            >
              <Text style={{ color: "#69bbfa" }}>
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
                    color: Colors.text,
                  }}
                >
                  |
                </Text>
                {getMessageById(message.parent) &&
                getMessageById(message.parent).content ? (
                  <Text style={{ color: Colors.text }}>
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
                  <Text>Deleted message</Text>
                )}
              </View>
            </View>
          )}
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
                  onClick={() => {
                    console.log("click");
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
              <Text style={{ color: Colors.text }}>{message.content}</Text>
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
                color: Colors.text,
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
                    color: Colors.text,
                  }}
                >
                  Edited
                </Text>
              )}
              <Text
                style={{
                  color: Colors.text,
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
                      color={"#69bbfa"}
                    />
                  ) : (
                    <Ionicons name="checkmark" size={18} color={"#69bbfa"} />
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
        {message.likes.length > 0 && (
          <View
            style={{
              position: "absolute",
              bottom: -15,
              left: 0,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {message.likes.map((el) => (
                <Ionicons name="heart-sharp" size={24} color="red" />
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
