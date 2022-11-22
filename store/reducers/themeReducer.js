import { SET_THEME } from "../actions/themeActions";
import Colors from "../../constants/Colors";

const initialState = {
  themeColors: Colors.light,
  theme: "light",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_THEME:
      return {
        themeColors: action.theme,
        theme: action.mode,
      };
    default:
      return state;
  }
};
