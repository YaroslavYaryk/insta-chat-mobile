import {
  SET_ACTIVE_USERS,
  ADD_USER_TO_ACTIVE,
  DELETE_USER_FROM_ACTIVE,
  FETCH_USER_DATA,
  CHANGE_USER_DATA,
} from "../actions/usersActions";

const initialState = {
  activeUsers: [],
  userData: {},
  //    projectReports: [],
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_USERS:
      return {
        ...state,
        activeUsers: action.activeUsers,
      };
    case ADD_USER_TO_ACTIVE:
      return {
        ...state,
        activeUsers: [...state.activeUsers, action.user],
      };

    case DELETE_USER_FROM_ACTIVE:
      return {
        ...state,
        activeUsers: state.activeUsers.filter((el) => el !== action.user),
      };
    case FETCH_USER_DATA:
      return {
        ...state,
        userData: action.user,
      };
    case CHANGE_USER_DATA:
      return {
        ...state,
        userData: action.user,
      };
  }
  return state;
};

export default usersReducer;
