import React, { useEffect, useCallback, useState, useReducer } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Colors from "../constants/Colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialIcons } from "@expo/vector-icons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Input from "../components/UI/Input";
import { JUST_HOST, PORT } from "../config/server";
import AwesomeAlert from "react-native-awesome-alerts";
import * as conversationActions from "../store/actions/conversationActions";
import { useDispatch, useSelector } from "react-redux";
import * as userActions from "../store/actions/usersActions";

export const UserInfo = (props) => {
  const { username, convName } = props.route.params;
  const userData = useSelector((state) => state.users.watchedUserInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  const loadUserData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(userActions.loadUserInfo(username));
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setError, setIsLoading]);

  useEffect(() => {
    loadUserData();
  }, [dispatch, loadUserData]);

  useEffect(() => {
    if (error) {
      setVisible(true);
    }
  }, [error]);

  const deleteConversation = async () => {
    setError(null);
    let action;

    action = conversationActions.deleteConversation(convName);
    setIsLoading(true);
    try {
      await dispatch(action);
      // props.navigation.navigate("Shop");
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
    props.navigation.navigate("Conversations");
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <AwesomeAlert
          show={visible}
          showProgress={false}
          title="Error"
          message={error}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Okay"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            setVisible(false);
          }}
          onConfirmPressed={() => {
            setVisible(false);
          }}
        />
      </View>
      <ScrollView>
        <View style={styles.imageBlock}>
          <View style={styles.logoContainer}>
            {userData.image ? (
              <Image
                source={{ uri: userData.image }}
                style={{ width: "100%", height: "100%", borderRadius: 100 }}
              />
            ) : (
              <Image
                source={require("../assets/man.png")}
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </View>
        </View>

        <View style={styles.input}>
          <Text style={styles.item}>{userData.first_name}</Text>
          <View style={styles.itemLabelBlock}>
            <Text style={styles.itemLabel}>First name</Text>
          </View>
        </View>
        <View style={styles.input}>
          <Text style={styles.item}>{userData.last_name}</Text>
          <View style={styles.itemLabelBlock}>
            <Text style={styles.itemLabel}>Last name</Text>
          </View>
        </View>
        <View style={styles.input}>
          <Text style={styles.item}>{userData.username}</Text>
          <View style={styles.itemLabelBlock}>
            <Text style={styles.itemLabel}>Username</Text>
          </View>
        </View>
        <View style={styles.input}>
          <Text style={styles.item}>{userData.email}</Text>
          <View style={styles.itemLabelBlock}>
            <Text style={styles.itemLabel}>Email</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={[styles.login]} onPress={deleteConversation}>
        <Text style={styles.loginLabel}>Delete conversation</Text>
      </TouchableOpacity>
    </View>
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: navData.route.params.username,
  };
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  imageBlock: {
    alignItems: "center",
  },
  logoContainer: {
    // flexDirection: "row",
    width: 150,
    height: 150,
  },
  input: {
    borderColor: "#ccc",
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginHorizontal: 24,
    marginVertical: 10,
    padding: 12,
    color: Colors.text,
  },
  login: {
    backgroundColor: "#FFA86F",
    borderRadius: 8,
    fontSize: 16,
    marginHorizontal: 24,
    marginVertical: 8,
    padding: 16,
  },
  loginLabel: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  register: {
    backgroundColor: "#fff",
    fontSize: 16,
    marginHorizontal: 24,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
  },
  registerLabel: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  inputContainer: {
    marginHorizontal: 20,
  },
  item: {
    color: Colors.text,
  },
  itemLabelBlock: {
    position: "absolute",
    left: 5,
  },
  itemLabel: {
    color: Colors.text,
    fontSize: 10,
  },
});

export default UserInfo;
