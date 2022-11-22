import Colors from "../../constants/Colors";

export const SET_THEME = "SET_THEME";

export const changeTheme = (mode) => {
  try {
    return (dispatch, getState) => {
      //  var token = getState().auth.token;
      var theme = "";
      if (mode == "light") {
        theme = Colors.light;
      } else {
        theme = Colors.dark;
      }
      dispatch({
        type: SET_THEME,
        theme: theme,
        mode: mode,
      });
    };
  } catch (err) {
    throw err;
  }
};
