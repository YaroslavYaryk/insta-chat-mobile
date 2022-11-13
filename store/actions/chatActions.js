import { HOST, PORT } from "../../config/server";
import Message from "../../Models/Message";
import UserModel from "../../Models/UserModel";
import MessageLike from "../../Models/MessageLike";
export const READ_MESSAGES = "READ_MESSAGES";
export const DELETE_MESSAGE = "DELETE_MESSAGE";
export const EDIT_MESSAGE = "EDIT_MESSAGE";
export const MESSAGE_LIKE = "MESSAGE_LIKE";
export const SET_MESSAGE_HISTORY = "SET_MESSAGE_HISTORY";
export const FETCH_MORE_MESSAGES = "FETCH_MORE_MESSAGES";

export const fetchMoreMessages = (conversationName, page) => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      var token = "5ac5b2ed8289b986f9bce9864305573ff8595a69";
      const response = await fetch(
        `${HOST}:${PORT}/chat/api/messages/?conversation=${conversationName}&page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Token ${token}`,
          },
        }
      );

      var newMessages = [];
      var hasMoreMessages = false;
      if (!response.ok) {
        console.log("error");
        dispatch({
          type: FETCH_MORE_MESSAGES,
          hasMoreMessages: false,
          newMessages: [],
        });
        return;
      } else {
        const resData = await response.json();
        hasMoreMessages = resData.next !== null;
        newMessages = resData.results;
      }

      dispatch({
        type: FETCH_MORE_MESSAGES,
        hasMoreMessages: hasMoreMessages,
        newMessages: newMessages,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const readMessages = () => {
  try {
    return (dispatch, getState) => {
      //  var token = getState().auth.token;

      dispatch({
        type: READ_MESSAGES,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const deleteMessage = (data) => {
  try {
    return (dispatch, getState) => {
      //  var token = getState().auth.token;

      dispatch({
        type: DELETE_MESSAGE,
        data: data,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const editMessage = (data) => {
  try {
    return (dispatch, getState) => {
      //  var token = getState().auth.token;

      dispatch({
        type: EDIT_MESSAGE,
        data: data,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const messageLike = (data) => {
  try {
    return (dispatch, getState) => {
      //  var token = getState().auth.token;

      dispatch({
        type: MESSAGE_LIKE,
        data: data,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const setMessageHistory = (messages, has_more_messages) => {
  try {
    return (dispatch, getState) => {
      //  var token = getState().auth.token;

      const messageHustory = [];
      for (const key in messages) {
        messageHustory.push(
          new Message(
            messages[key].id,
            messages[key].conversation,
            new UserModel(
              messages[key].from_user.id,
              messages[key].from_user.username,
              messages[key].from_user.email,
              messages[key].from_user.first_name,
              messages[key].from_user.last_name,
              messages[key].from_user.image
            ),
            new UserModel(
              messages[key].to_user.id,
              messages[key].to_user.username,
              messages[key].to_user.email,
              messages[key].to_user.first_name,
              messages[key].to_user.last_name,
              messages[key].to_user.image
            ),
            messages[key].content,
            messages[key].timestamp,
            messages[key].read,
            messages[key].edited,
            messages[key].forwarded,
            messages[key].images,
            messages[key].likes.length
              ? new MessageLike(
                  messages[key].likes.message,
                  messages[key].likes.user
                )
              : [],
            messages[key].parent,
            messages[key].ref,
            messages[key].scroll
          )
        );
      }

      dispatch({
        type: SET_MESSAGE_HISTORY,
        messageHustory: messageHustory,
        hasMoreMessages: has_more_messages,
      });
    };
  } catch (err) {
    throw err;
  }
};
