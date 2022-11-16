import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { StyleSheet, Text, View } from "react-native";
import useCachedResources from "./hooks/useCachedResources";
import ReduxThunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { combineReducers, applyMiddleware } from "redux";
import { LogBox } from "react-native";

import BaseAuthNavigator from "./navigation/Navigator";
import conversationReducer from "./store/reducers/conversationReducer";
import usersReducer from "./store/reducers/usersReducer";
import chatReducer from "./store/reducers/chatReducer";
import authReducer from "./store/reducers/authReducer";

const rootReducer = combineReducers({
  conversations: conversationReducer,
  users: usersReducer,
  chat: chatReducer,
  auth: authReducer,
});

const store = configureStore(
  {
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
  },
  applyMiddleware(ReduxThunk)
);

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <BaseAuthNavigator />
      </Provider>
    );
  }
}
