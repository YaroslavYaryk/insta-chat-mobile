import React, { useReducer, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const { colors } = useTheme();

  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "",
    isValid: props.initiallyValid,
    touched: false,
  });
  const [error, setError] = useState(props.errorText);
  const [hiddenText, setHiddenText] = useState(props.secureTextEntry);
  const [hideUnhideTextIcon, setHideUnhideTextIcon] = useState("eye-off");

  const { onInputChange, id } = props;

  useEffect(() => {
    if (inputState.touched) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);

  const textChangeHandler = (text) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const intRegex = /^\d+$/;

    const phoneRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
      console.log("1");
    }

    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
      console.log("2");
    }

    if (props.integer && !intRegex.test(text.toLowerCase())) {
      isValid = false;
    }

    if (props.phone && !phoneRegex.test(text.toLowerCase())) {
      isValid = false;
    }

    if (props.password && text.trim().length < 8) {
      isValid = false;
      setError("Password is required to be not less than 8 ");
    }

    if (props.min != null && +text < props.min) {
      console.log("3");
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
      console.log("4");
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
      console.log("5");
    }

    if (props.id == "price" && !text.match(/^-?\d*(\.\d+)?$/)) {
      isValid = false;
    }

    dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };

  const reveal1Password = () => {
    setHiddenText(!hiddenText);
    if (hideUnhideTextIcon == "eye-off") {
      setHideUnhideTextIcon("eye");
    } else {
      setHideUnhideTextIcon("eye-off");
    }
  };

  const lostFocusHandler = () => {
    dispatch({ type: INPUT_BLUR });
  };

  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            height: props.height ? props.height : null,
            borderBottomColor: colors.headerBold,
          },
        ]}
        {...props}
        secureTextEntry={hiddenText}
        value={inputState.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocusHandler}
      />
      {[
        "password",
        "confirmPassword",
        "newPassword",
        "newPasswordConfirm",
        "oldPassword",
      ].includes(id) && (
        <TouchableOpacity
          style={styles.inputPasswordSee}
          onPress={reveal1Password}
        >
          <Ionicons name={hideUnhideTextIcon} size={24} color="grey" />
        </TouchableOpacity>
      )}
      <View style={{}}>
        {!inputState.isValid && inputState.touched && props.required && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {props.dontMatchError && inputState.touched && (
          <View style={[styles.errorContainer]}>
            <Text style={styles.errorText}>{props.dontMatchError}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: "100%",
  },
  label: {
    // fontFamily: "open-sans",
    marginVertical: 8,
    fontWeight: "500",
    fontSize: 16,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 0,

    borderBottomWidth: 1,
  },
  errorContainer: {
    marginTop: 10,
    marginLeft: 25,
  },
  inputPasswordSee: {
    position: "absolute",
    top: 44,
    right: 35,
  },
  errorText: {
    fontFamily: "open-sans",
    color: "red",
    fontSize: 13,
  },
});

export default Input;
