import {
  SET_ACTIVE_USERS,
  ADD_USER_TO_ACTIVE,
  DELETE_USER_FROM_ACTIVE,
} from "../actions/usersActions";

const initialState = {
  activeUsers: [],
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
  }
  return state;
};

export default usersReducer;
