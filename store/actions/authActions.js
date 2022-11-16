import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from "react-native";
import { HOST, PORT } from "../../config/server";

LogBox.ignoreLogs(["Setting a timer"]);

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

let timer;

export const authenticate = (token, username, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, token: token, username: username });
  };
};

export const signUp = (firstName, lastName, username, password) => {
  return async (dispatch) => {
    const response = await fetch(`${HOST}:${PORT}/users/api/auth/register/`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        username: username,
        first_name: firstName,
        last_name: lastName,
        password: password,
      }),
    });
    if (!response.ok) {
      var message = "";
      try {
        const errorResData = await response.text();
        message = JSON.parse(errorResData).message;
      } catch (error) {
        message = "Something went wrong!";
      }
      throw new Error(message);
    }
    const resData = await response.json();
    dispatch(authenticate(resData.token, resData.username, 1800 * 100000));
    const expirationDate = new Date(new Date().getTime() + 1800 * 100000);
    saveDataToStorage(resData.token, resData.username, expirationDate);
  };
};

export const login = (username, password) => {
  return async (dispatch) => {
    const response = await fetch(`${HOST}:${PORT}/users/api/auth/login/`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    if (!response.ok) {
      var message;
      try {
        const errorResData = await response.text();
        message = JSON.parse(errorResData).message;
      } catch (error) {
        message = "Something went wrong!";
      }
      throw new Error(message);
    }
    const resData = await response.json();
    dispatch(authenticate(resData.token, resData.username, 1800 * 100000));
    const expirationDate = new Date(new Date().getTime() + 1800 * 100000);
    saveDataToStorage(resData.token, resData.username, expirationDate);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, username, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      username: username,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
