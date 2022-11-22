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
  Dimensions,
} from "react-native";
import Colors from "../constants/Colors";

import AwesomeAlert from "react-native-awesome-alerts";
import * as conversationActions from "../store/actions/conversationActions";
import { useDispatch, useSelector } from "react-redux";
import * as userActions from "../store/actions/usersActions";
import CustomModal from "../components/CustomModal";
import { FontAwesome } from "@expo/vector-icons";

import { useTheme } from "@react-navigation/native";
import { color } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export const UserInfo = (props) => {
  const { colors } = useTheme();

  const { username, convName } = props.route.params;
  const userData = useSelector((state) => state.users.watchedUserInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [imagePreview, setImagePreview] = useState("");

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
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
        <TouchableOpacity
          onPress={() => {
            setImagePreview(true);
          }}
        >
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
        </TouchableOpacity>

        <View
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.inputBorder },
          ]}
        >
          <Text style={{ color: colors.text }}>{userData.first_name}</Text>
          <View style={styles.itemLabelBlock}>
            <Text style={[styles.itemLabel, { color: colors.text }]}>
              First name
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.inputBorder },
          ]}
        >
          <Text style={{ color: colors.text }}>{userData.last_name}</Text>
          <View style={styles.itemLabelBlock}>
            <Text style={[styles.itemLabel, { color: colors.text }]}>
              Last name
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.inputBorder },
          ]}
        >
          <Text style={{ color: colors.text }}>{userData.username}</Text>
          <View style={styles.itemLabelBlock}>
            <Text style={[styles.itemLabel, { color: colors.text }]}>
              Username
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.inputBorder },
          ]}
        >
          <Text style={{ color: colors.text }}>{userData.email}</Text>
          <View style={styles.itemLabelBlock}>
            <Text style={[styles.itemLabel, { color: colors.text }]}>
              Email
            </Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={[styles.login]} onPress={deleteConversation}>
        <Text style={[styles.loginLabel, { color: colors.text }]}>
          Delete conversation
        </Text>
      </TouchableOpacity>
      {imagePreview && (
        <CustomModal
          isOpen={imagePreview}
          close={() => {
            setImagePreview(false);
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
            {userData.image ? (
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "center",
                  // borderRadius: "50%",
                  // borderRadius: 100,
                }}
                source={{
                  uri: userData.image,
                }}
              />
            ) : (
              <Image
                source={require("../assets/man.png")}
                style={{ width: "100%", height: "100%", resizeMode: "center" }}
              />
            )}
            <View style={{ position: "absolute", top: 0, right: 10 }}>
              <FontAwesome
                name="times"
                size={40}
                color="grey"
                onPress={() => {
                  setImagePreview(false);
                }}
              />
            </View>
          </View>
        </CustomModal>
      )}
    </View>
  );
};

export const screenOptions = (navData) => {
  const { colors } = useTheme();
  return {
    headerTitle: () => (
      <View>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: "700" }}>
          {navData.route.params.username}
        </Text>
      </View>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageBlock: {
    alignItems: "center",
    marginTop: 10,
  },
  logoContainer: {
    // flexDirection: "row",
    width: 150,
    height: 150,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginHorizontal: 24,
    marginVertical: 10,
    padding: 12,
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
  itemLabelBlock: {
    position: "absolute",
    left: 5,
  },
  itemLabel: {
    fontSize: 10,
  },
});

export default UserInfo;
