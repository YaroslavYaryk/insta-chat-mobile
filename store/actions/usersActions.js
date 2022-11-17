import { HOST, PORT } from "../../config/server";
import UserModel from "../../Models/UserModel";
export const SET_ACTIVE_USERS = "SET_ACTIVE_USERS";
export const ADD_USER_TO_ACTIVE = "ADD_USER_TO_ACTIVE";
export const DELETE_USER_FROM_ACTIVE = "DELETE_USER_FROM_ACTIVE";
export const FETCH_USER_DATA = "FETCH_USER_DATA";
export const CHANGE_USER_DATA = "CHANGE_USER_DATA";
export const FETCH_ALL_USERS = "FETCH_ALL_USERS";
export const FETCH_USER_INFO_TO_WATCH = "FETCH_USER_INFO_TO_WATCH";

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

export const fetchUserData = () => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      var token = getState().auth.token;
      const response = await fetch(`${HOST}:${PORT}/users/api/one/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Token ${token}`,
        },
      });

      const resData = await response.json();
      const user = new UserModel(
        resData.id,
        resData.username,
        resData.email,
        resData.first_name,
        resData.last_name,
        resData.image
      );

      dispatch({
        type: FETCH_USER_DATA,
        user: user,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const changeUserData = (
  first_name,
  last_name,
  username,
  email,
  image,
  old
) => {
  try {
    return async (dispatch, getState) => {
      let formdata = new FormData();

      formdata.append("first_name", first_name);
      formdata.append("last_name", last_name);
      formdata.append("username", username);
      formdata.append("email", email);

      if (old) {
        formdata.append("image", image);
      } else {
        formdata.append("image", {
          uri: image,
          name: `image_${Math.random()}.jpg`,
          type: "image/jpeg",
        });
      }
      var token = getState().auth.token;
      const response = await fetch(`${HOST}:${PORT}/users/api/one/change/`, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Token ${token}`,
        },
        body: formdata,
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
      const user = new UserModel(
        resData.id,
        username,
        email,
        first_name,
        last_name,
        resData.image
      );

      dispatch({
        type: CHANGE_USER_DATA,
        user: user,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const fetchAllUsers = () => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      var token = getState().auth.token;
      const response = await fetch(`${HOST}:${PORT}/users/api/all/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Token ${token}`,
        },
      });

      const resData = await response.json();
      var users = [];
      for (const key in resData) {
        users.push(
          new UserModel(
            resData[key].id,
            resData[key].username,
            resData[key].email,
            resData[key].first_name,
            resData[key].last_name,
            resData[key].image
          )
        );
      }

      dispatch({
        type: FETCH_ALL_USERS,
        users: users,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const loadUserInfo = (username) => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      var token = getState().auth.token;
      const response = await fetch(
        `${HOST}:${PORT}/users/api/one/${username}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Token ${token}`,
          },
        }
      );

      const resData = await response.json();
      var user = new UserModel(
        resData.id,
        resData.username,
        resData.email,
        resData.first_name,
        resData.last_name,
        resData.image
      );

      dispatch({
        type: FETCH_USER_INFO_TO_WATCH,
        user: user,
      });
    };
  } catch (err) {
    throw err;
  }
};
