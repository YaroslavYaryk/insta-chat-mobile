import {
  READ_CONVERSATIONS,
  ADD_LAST_MESSAGE_TO_CONVERSATION,
  SET_UNREAD_MESSAGES,
  ADD_UNREAD_MESSAGE,
  DELETE_UNREAD_MESSAGE,
} from "../actions/conversationActions";

const initialState = {
  conversations: [],
  unreadMessages: [],
  //    projectReports: [],
};

const conversationReducer = (state = initialState, action) => {
  switch (action.type) {
    case READ_CONVERSATIONS:
      return {
        ...state,
        conversations: action.conversations,
      };
    case ADD_LAST_MESSAGE_TO_CONVERSATION:
      var oldConversations = [...state.conversations];
      var index = oldConversations.findIndex(
        (el) => el.name === action.data.name
      );
      var oldConversation = oldConversations[index];
      if (oldConversation) {
        oldConversation.last_message = action.data.message;
        oldConversations[index] = oldConversation;
      }

      return {
        ...state,
        conversations: oldConversations,
      };

    case SET_UNREAD_MESSAGES:
      return {
        ...state,
        unreadMessages: JSON.parse(action.data.unread_messages),
      };

    case ADD_UNREAD_MESSAGE:
      var oldMessages = [...state.unreadMessages];
      const convName = action.data.name;
      var index = oldMessages.findIndex((el) => el.name === convName);
      if (index == -1) {
        var newElem = { name: convName, count: 1 };
        oldMessages.concat(newElem);
      } else {
        var oldElem = oldMessages[index];
        oldElem.count += 1;
        oldMessages[index] = oldElem;
      }

      return {
        ...state,
        unreadMessages: oldMessages,
      };
    case DELETE_UNREAD_MESSAGE:
      var oldMessages = [...state.unreadMessages];
      var conversationName = action.data.name;
      var index = oldMessages.findIndex((el) => el.name === conversationName);
      if (index == -1) {
        var newElem = { name: conversationName, count: 0 };
        oldMessages.concat(newElem);
      } else {
        var oldElem = oldMessages[index];
        oldElem.count -= 1;
        oldMessages[index] = oldElem;
      }
      return {
        ...state,
        unreadMessages: oldMessages,
      };
  }
  return state;
};

export default conversationReducer;
