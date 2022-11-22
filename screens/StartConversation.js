import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import Colors from "../constants/Colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialIcons } from "@expo/vector-icons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import { JUST_HOST, PORT } from "../config/server";

import { useDispatch, useSelector } from "react-redux";
import * as conversationActions from "../store/actions/conversationActions";
import * as usersActions from "../store/actions/usersActions";
import ChooseConversation from "../components/ChooseConversation";
import { useIsFocused } from "@react-navigation/native";

import { useTheme } from "@react-navigation/native";

export const StartConversation = (props) => {
  const { colors } = useTheme();

  const user = useSelector((state) => state.auth);

  const allUsers = useSelector((state) => state.users.allUsers);
  const [userQuery, setUserQuery] = useState([]);

  const [inputValue, setInputValue] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // const [refreshing, setRefreshing] = useState(true);

  const dispatch = useDispatch();

  const isFocused = useIsFocused();

  function createConversationName(username) {
    const namesAlph = [user.username, username].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  const LoadUsers = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(usersActions.fetchAllUsers());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setError, setIsLoading]);

  useEffect(() => {
    LoadUsers();
    setUserQuery(allUsers);
  }, [dispatch, LoadUsers, isFocused]);

  useEffect(() => {
    setUserQuery(allUsers);
  }, [allUsers]);

  const handleSelectChat = (username) => {
    const convName = createConversationName(username);
    props.navigation.navigate("Chat", {
      conversationName: convName,
    });
  };

  const textChangeHandler = (word) => {
    setInputValue(word);
    if (word) {
      const newOne = allUsers.filter((el) =>
        el.username.toLowerCase().includes(word.toLowerCase())
      );
      setUserQuery(newOne);
    } else {
      setUserQuery(allUsers);
    }
  };

  const onRefresh = () => {
    LoadUsers();
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator

      <View
        style={{
          height: 0.5,

          width: "100%",

          backgroundColor: "#C8C8C8",
        }}
      />
    );
  };

  if (allUsers.length == 0) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>You dont have conversations</Text>
      </View>
    );
  }

  // if (isLoading) {
  //   return (
  //     <View style={styles.centered}>
  //       <ActivityIndicator size="large" color={colors.primary} />
  //     </View>
  //   );
  // }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchSection}>
        <TextInput
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.inputColor },
          ]}
          value={inputValue}
          onChangeText={(el) => {
            textChangeHandler(el);
          }}
          placeholder="Search user"
          placeholderTextColor={colors.text}
        />
      </View>
      <FlatList
        // onScroll={scrollHandler}
        // ref={ref}
        data={userQuery}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparatorView}
        enableEmptySections={true}
        renderItem={(itemData) => (
          <View key={Math.random() + Math.random()} style={{ marginBottom: 0 }}>
            <TouchableOpacity
              onPress={() => {
                handleSelectChat(itemData.item.username);
              }}
            >
              <ChooseConversation
                item={itemData.item}
                // unreadMessages={unreadMessages}
                // onSelect={handleSelectChat}
                //  handleEdit={() => {
                //     props.navigation.navigate("EditProject", {
                //        projectId: itemData.item.id,
                //     });
                //  }}
                //  handleDelete={() => {
                //     handleProjectDelete(itemData.item.id);
                //  }}
              ></ChooseConversation>
            </TouchableOpacity>
          </View>
        )}
        refreshControl={
          <RefreshControl
            //refresh control used for the Pull to Refresh
            refreshing={isLoading}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: "Select chat...",
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    // marginHorizontal: 24,
    marginVertical: 10,
    padding: 12,

    placeholderTextColor: "white",
  },
});
