import { HOST, PORT } from "../../config/server";
export const READ_CONVERSATIONS = "READ_CONVERSATION";
export const SET_UNREAD_MESSAGES = "SET_UNREAD_MESSAGES";
export const ADD_UNREAD_MESSAGE = "ADD_UNREAD_MESSAGE";
export const DELETE_UNREAD_MESSAGE = "DELETE_UNREAD_MESSAGE";
export const DELETE_CONVERSATION = "DELETE_CONVERSATION";
export const ADD_LAST_MESSAGE_TO_CONVERSATION =
  "ADD_LAST_MESSAGE_TO_CONVERSATION";

export const fetchConversations = () => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      var token = getState().auth.token;

      const response = await fetch(
        `${HOST}:${PORT}/chat/api/active_conversation/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();

      dispatch({
        type: READ_CONVERSATIONS,
        conversations: resData,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const deleteConversation = (name) => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      var token = getState().auth.token;

      const response = await fetch(
        `${HOST}:${PORT}/chat/api/delete_conversation/${name}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      dispatch({
        type: DELETE_CONVERSATION,
        name: name,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const addLastUnreadMessageToConversation = (data) => {
  try {
    return (dispatch, getState) => {
      //  var token = getState().auth.token;

      dispatch({
        type: ADD_LAST_MESSAGE_TO_CONVERSATION,
        data: data,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const setUnreadMessaages = (data) => {
  try {
    return (dispatch, getState) => {
      //  var token = getState().auth.token;

      dispatch({
        type: SET_UNREAD_MESSAGES,
        data: data,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const addUnreadMessage = (data) => {
  try {
    return (dispatch, getState) => {
      //  var token = getState().auth.token;

      dispatch({
        type: ADD_UNREAD_MESSAGE,
        data: data,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const deleteUnreadMessage = (data) => {
  try {
    return (dispatch, getState) => {
      //  var token = getState().auth.token;

      dispatch({
        type: DELETE_UNREAD_MESSAGE,
        data: data,
      });
    };
  } catch (err) {
    throw err;
  }
};
