import { HOST, PORT } from "../../config/server";
export const SET_ACTIVE_USERS = "SET_ACTIVE_USERS";
export const ADD_USER_TO_ACTIVE = "ADD_USER_TO_ACTIVE";
export const DELETE_USER_FROM_ACTIVE = "DELETE_USER_FROM_ACTIVE";

export const SetActiveUsers = (data) => {
  try {
    return (dispatch, getState) => {
      //  var token = getState().auth.token;

      dispatch({
        type: SET_ACTIVE_USERS,
        activeUsers: data,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const addUserToActive = (user) => {
  try {
    return (dispatch, getState) => {
      //  var token = getState().auth.token;

      dispatch({
        type: ADD_USER_TO_ACTIVE,
        user: user,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const deleteUserFromActive = (user) => {
  try {
    return (dispatch, getState) => {
      //  var token = getState().auth.token;

      dispatch({
        type: DELETE_USER_FROM_ACTIVE,
        user: user,
      });
    };
  } catch (err) {
    throw err;
  }
};
