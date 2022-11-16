import { AUTHENTICATE, LOGOUT } from "../actions/authActions";

const initialState = {
  token: null,
  username: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        username: action.username,
      };
    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};
