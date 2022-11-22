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
  RefreshControl,
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

import useWebSocket from "react-use-websocket";
import { useDispatch, useSelector } from "react-redux";
import * as userActions from "../store/actions/usersActions";
import * as ImagePicker from "expo-image-picker";

import { useIsFocused, useTheme } from "@react-navigation/native";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const Settings = (props) => {
  const { colors } = useTheme();
  const userData = useSelector((state) => state.users.userData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [diabledButton, setDisabledButton] = useState(true);
  const [userImage, setUserImage] = useState(
    userData.image ? userData.image : ""
  );
  const isFocused = useIsFocused();

  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  const loadUserData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(userActions.fetchUserData());
    } catch (err) {
      setError(err.message);
    }
    // setUserImage(userData.image);
    setIsLoading(false);
  }, [dispatch, setError, setIsLoading, isFocused]);

  useEffect(() => {
    loadUserData();
  }, [dispatch, loadUserData, isFocused]);

  useEffect(() => {
    if (error) {
      setVisible(true);
    }
  }, [error]);

  useEffect(() => {
    if (formState.formIsValid) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  });

  const changeUserData = async () => {
    setError(null);
    let action;
    if (!userImage) {
      setVisible(true);
      setError("Image cannot be empty");
      return;
    }
    action = userActions.changeUserData(
      formState.inputValues.firstName,
      formState.inputValues.lastName,
      formState.inputValues.username,
      formState.inputValues.email,
      userImage,
      userData.image == userImage
    );
    setIsLoading(true);
    try {
      await dispatch(action);
      // props.navigation.navigate("Shop");
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      firstName: userData.first_name ? userData.first_name : "",
      lastName: userData.last_name ? userData.last_name : "",
      username: userData.username ? userData.username : "",
      email: userData.email ? userData.email : "",
    },
    inputValidities: {
      firstName: userData.first_name ? true : false,
      lastName: userData.first_name ? true : false,
      username: userData.username ? true : false,
      email: userData.email ? true : false,
    },
    formIsValid:
      userData.first_name &&
      userData.first_name &&
      userData.username &&
      userData.email,
  });

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      setUserImage(result.assets[0].uri);
    }
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator

      <View
        style={{
          height: 0.5,

          width: "100%",
        }}
      />
    );
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
      <ScrollView
        ItemSeparatorComponent={ItemSeparatorView}
        enableEmptySections={true}
        refreshControl={
          <RefreshControl
            //refresh control used for the Pull to Refresh
            refreshing={isLoading}
            onRefresh={loadUserData}
          />
        }
      >
        <View style={styles.imageBlock}>
          <View style={styles.logoContainer}>
            <TouchableOpacity onPress={pickImage}>
              {userImage ? (
                <Image
                  source={{ uri: userImage }}
                  style={{ width: "100%", height: "100%", borderRadius: 100 }}
                />
              ) : (
                <Image
                  source={require("../assets/man.png")}
                  style={{ width: "100%", height: "100%" }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <Input
          id="firstName"
          keyboardType="default"
          required
          secureTextEntry={false}
          autoCapitalize="none"
          errorText="Please enter a valid first name."
          onInputChange={inputChangeHandler}
          initialValue={userData.first_name ? userData.first_name : ""}
          placeholder="First name"
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.inputBorder },
          ]}
          placeholderTextColor={colors.text}
        />
        <Input
          id="lastName"
          keyboardType="default"
          required
          secureTextEntry={false}
          autoCapitalize="none"
          errorText="Please enter a valid last name."
          onInputChange={inputChangeHandler}
          initialValue={userData.last_name ? userData.last_name : ""}
          placeholder="Last name"
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.inputBorder },
          ]}
          placeholderTextColor={colors.text}
        />
        <Input
          id="username"
          keyboardType="default"
          required
          secureTextEntry={false}
          autoCapitalize="none"
          errorText="Please enter a valid username."
          onInputChange={inputChangeHandler}
          initialValue={userData.username ? userData.username : ""}
          placeholder="Username"
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.inputBorder },
          ]}
          placeholderTextColor={colors.text}
        />
        <Input
          id="email"
          keyboardType="default"
          required
          email
          secureTextEntry={false}
          autoCapitalize="none"
          errorText="Please enter a valid email."
          onInputChange={inputChangeHandler}
          initialValue={userData.email ? userData.email : ""}
          placeholder="Email"
          style={[
            styles.input,
            {
              marginBottom: 10,
              color: colors.text,
              borderColor: colors.inputBorder,
            },
          ]}
          placeholderTextColor={colors.text}
        />

        <TouchableOpacity
          disabled={diabledButton}
          style={[
            styles.login,
            { backgroundColor: diabledButton ? "grey" : "#3B82F6" },
          ]}
          onPress={changeUserData}
        >
          <Text style={[styles.loginLabel, { color: colors.text }]}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export const screenOptions = (navData) => {
  const { colors } = useTheme();
  return {
    headerTitle: "Settings",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          style={{ marginLeft: -20, padding: 0 }}
          title="search"
          color={colors.text}
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
    marginVertical: -8,
    padding: 12,
  },
  login: {
    backgroundColor: "#3B82F6",
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
});

export default Settings;
