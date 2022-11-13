import {
  READ_MESSAGES,
  DELETE_MESSAGE,
  EDIT_MESSAGE,
  MESSAGE_LIKE,
  SET_MESSAGE_HISTORY,
  FETCH_MORE_MESSAGES,
} from "../actions/chatActions";

const initialState = {
  participants: [],
  messageHistory: [],
  hasMoreMessages: false,
  //    projectReports: [],
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case READ_MESSAGES:
      var oldMessHistory = [...state.messageHistory];
      oldMessHistory.map((el) => {
        if (!el.read) {
          el.read = true;
        }
      });

      return {
        ...state,
        messageHistory: oldMessHistory,
      };

    case DELETE_MESSAGE:
      setMessageHistory((prev) =>
        prev.filter((el) => el.id !== data.message_id)
      );
      return {
        ...state,
        messageHistory: state.messageHistory.filter(
          (el) => el.id !== action.data.message_id
        ),
      };
    case EDIT_MESSAGE:
      var oldMessages = [...state.messageHistory];
      var index = oldMessages.findIndex(
        (el) => el.id === action.data.message.id
      );
      oldMessages[index] = action.data.message;
      return {
        ...state,
        messageHistory: oldMessHistory,
      };

    case MESSAGE_LIKE:
      var oldMessages = [...state.messageHistory];
      var index = oldMessages.findIndex(
        (el) => el.id === action.data.message_id
      );
      var oldMessage = oldMessages[index];
      oldMessage.likes = action.data.message_likes;
      oldMessages[index] = oldMessage;
      return {
        ...state,
        messageHistory: oldMessages,
      };

    case SET_MESSAGE_HISTORY:
      return {
        ...state,
        messageHistory: action.messageHustory,
        hasMoreMessages: action.hasMoreMessages,
      };
    case FETCH_MORE_MESSAGES:
      return {
        ...state,
        messageHistory: state.messageHistory.concat(action.newMessages),
        hasMoreMessages: action.hasMoreMessages,
      };
  }
  return state;
};

export default chatReducer;
