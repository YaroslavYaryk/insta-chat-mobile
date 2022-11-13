import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { formatMessageTimestamp } from "../services/TimeServices";

export const ConversationItem = (props) => {
  const messageCount = props.unreadMessages.find(
    (el) => el.name == props.item.name
  )?.count;

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#435264",
        padding: 10,
        position: "relative",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ height: 55, width: 55 }}>
          {props.item.other_user.image ? (
            <Image
              style={{
                width: "100%",
                height: "100%",
                // borderRadius: "50%",
                borderRadius: 100,
              }}
              source={{
                uri: props.item.other_user.image,
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
              style={{ color: Colors.text, fontSize: 17, fontWeight: "600" }}
            >
              {props.item.other_user.username}
            </Text>
            <Text style={{ color: Colors.text, marginTop: 8 }}>
              {props.item.last_message.content ? (
                props.item.last_message.content.toString().length > 20 ? (
                  <Text
                    style={{ fontSize: 14 }}
                  >{`${props.item.last_message?.content.slice(
                    0,
                    21
                  )}...`}</Text>
                ) : (
                  <Text style={{ fontSize: 14 }}>
                    {props.item.last_message?.content}
                  </Text>
                )
              ) : props.item.last_message?.images ? (
                <Text style={{ fontSize: 14 }}>photo message</Text>
              ) : (
                <Text></Text>
              )}
            </Text>
          </View>
        </View>
        <View style={{ position: "absolute", bottom: 5, right: 0 }}>
          <Text style={{ color: Colors.text }}>
            {formatMessageTimestamp(props.item.last_message.timestamp)}
          </Text>
        </View>
        {props.unreadMessages &&
          props.unreadMessages.find((el) => el.name == props.item.name) &&
          props.unreadMessages.find((el) => el.name == props.item.name).count >
            0 && (
            <View style={{ position: "absolute", top: -5, right: 0 }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "white",
                  padding: 5,
                  paddingHorizontal: messageCount >= 10 ? 7 : 10,
                  borderRadius: 200,
                }}
              >
                <Text style={{ color: Colors.text }}>
                  {
                    props.unreadMessages.find(
                      (el) => el.name == props.item.name
                    )?.count
                  }
                </Text>
              </View>
            </View>
          )}
      </View>
    </View>
  );
};
