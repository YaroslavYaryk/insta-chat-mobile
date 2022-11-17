import React, { useEffect, useState, useCallback, useReducer } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
  Image,
  Dimensions,
} from "react-native";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../../store/actions/authActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/CustomHeaderButton";
import { MaterialIcons } from "@expo/vector-icons";
const { width } = Dimensions.get("window");
import { HOST, PORT } from "../../config/server";
import SeccessPopup from "../../components/UI/SuccessPopup";

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

const Registration = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [diabledButton, setDisabledButton] = useState(true);
  const [dontMatchError, setDontMatchError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occured", error, [
        { text: "Okay", onPress: setError(null) },
      ]);
    }
  }, [error]);

  useEffect(() => {
    if (
      formState.formIsValid &&
      formState.inputValues.password === formState.inputValues.confirmPassword
    ) {
      setDisabledButton(false);
      setDontMatchError(null);
    } else {
      setDisabledButton(true);
      setDontMatchError("passwords don't match.");
    }
  });

  const authHandler = async () => {
    setError(null);
    let action;

    action = authActions.signUp(
      formState.inputValues.firstName,
      formState.inputValues.lastName,
      formState.inputValues.username,
      formState.inputValues.password
    );
    setIsLoading(true);
    try {
      await dispatch(action);
      // props.navigation.navigate("Shop");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    inputValidities: {
      firstName: false,
      lastName: false,
      username: false,
      password: false,
      confirmPassword: false,
    },
    formIsValid: false,
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

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.logoContainer}>
          <Image source={require("../../assets/logo.png")} />
        </View>
        <Input
          id="firstName"
          keyboardType="default"
          required
          secureTextEntry={false}
          autoCapitalize="none"
          errorText="Please enter a valid first name."
          onInputChange={inputChangeHandler}
          initialValue=""
          login={true}
          placeholder="First name"
          style={styles.input}
          placeholderTextColor={Colors.text}
        />
        <Input
          id="lastName"
          keyboardType="default"
          required
          secureTextEntry={false}
          autoCapitalize="none"
          errorText="Please enter a valid last name."
          onInputChange={inputChangeHandler}
          initialValue=""
          login={true}
          placeholder="Last name"
          style={styles.input}
          placeholderTextColor={Colors.text}
        />
        <Input
          id="username"
          keyboardType="default"
          required
          secureTextEntry={false}
          autoCapitalize="none"
          errorText="Please enter a valid username."
          onInputChange={inputChangeHandler}
          initialValue=""
          login={true}
          placeholder="Username"
          style={styles.input}
          placeholderTextColor={Colors.text}
        />
        <Input
          id="password"
          keyboardType="default"
          secureTextEntry={true}
          required
          password
          minLength={8}
          autoCapitalize="none"
          errorText="Please enter a valid password."
          onInputChange={inputChangeHandler}
          initialValue=""
          login={true}
          placeholder="Password"
          style={[styles.input]}
          placeholderTextColor={Colors.text}
        />
        <Input
          id="confirmPassword"
          keyboardType="default"
          secureTextEntry={true}
          required
          password
          minLength={8}
          autoCapitalize="none"
          errorText="Please enter a valid password."
          onInputChange={inputChangeHandler}
          initialValue=""
          login={true}
          dontMatchError={dontMatchError}
          placeholder="Confirm password"
          style={[styles.input, { marginBottom: 0 }]}
          placeholderTextColor={Colors.text}
        />
      </ScrollView>
      <TouchableOpacity
        disabled={diabledButton}
        style={[
          styles.login,
          { backgroundColor: diabledButton ? "grey" : "#3B82F6" },
        ]}
        onPress={authHandler}
      >
        <Text style={styles.loginLabel}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.register}
        onPress={() => {
          props.navigation.navigate("Login");
        }}
      >
        <Text style={styles.registerLabel}>Login</Text>
      </TouchableOpacity>
      <SeccessPopup
        visible={visible}
        setVisible={setVisible}
        message={message}
      />
    </View>
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: "Instagram",
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  logoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  input: {
    borderColor: "#ccc",
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginHorizontal: 24,
    marginVertical: -8,
    padding: 12,
    color: Colors.text,
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
});

export default Registration;
