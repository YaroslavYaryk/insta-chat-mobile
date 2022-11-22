import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
  ActivityIndicator,
  Animated,
  LayoutAnimation,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as authActions from "../../store/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/Colors";
import * as userActions from "../../store/actions/usersActions";
import { toggleAnimation } from "../../constants/anumatuion";
import * as themeActions from "../../store/actions/themeActions";

import {
  Transition,
  Transitioning,
  TransitioningView,
} from "react-native-reanimated";
import { useTheme } from "@react-navigation/native";

const transition = (
  <Transition.Together>
    <Transition.Out type="scale" durationMs={100} />
    <Transition.Change interpolation="easeInOut" />
    <Transition.In type="scale" durationMs={100} delayMs={50} />
  </Transition.Together>
);

const CustomDrawer = (props) => {
  const { colors } = useTheme();

  const user = useSelector((state) => state.users.userData);

  const theme = useSelector((state) => state.theme.theme);
  console.log(useSelector((state) => state.theme));

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const dispatch = useDispatch();

  const ref = useRef(null);
  const [toggled, setToggled] = React.useState(false);

  const toggle = () => setToggled(!toggled);

  const animationController = useRef(new Animated.Value(0)).current;

  const toggleListItem = () => {
    const config = {
      duration: 500,
      toValue: toggled ? 0 : 1,
      useNativeDriver: true,
    };
    Animated.timing(animationController, config).start();
    LayoutAnimation.configureNext(toggleAnimation);
    toggle();
    var mode = "light";
    if (theme == "light") {
      mode = "dark";
    }
    dispatch(themeActions.changeTheme(mode));
  };

  const arrowTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const loadUserData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(userActions.fetchUserData());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setError, setIsLoading]);

  useEffect(() => {
    loadUserData();
  }, [dispatch, loadUserData]);

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text>{error}</Text>
        <Button
          title="Try Again"
          onPress={loadUserData}
          color={colors.backgroundLighter}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primaryColor} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{}}>
        <ImageBackground
          source={require("../../assets/leaves.jpg")}
          style={{ padding: 20 }}
          imageStyle={{ opacity: 0.2 }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              {user.image ? (
                <Image
                  source={{ uri: user.image }}
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 40,
                    marginBottom: 10,
                  }}
                />
              ) : (
                <Image
                  source={require("../../assets/man.png")}
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 40,
                    marginBottom: 10,
                  }}
                />
              )}
              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                  marginBottom: 5,
                }}
              >
                {user.first_name} {user.last_name}
              </Text>
            </View>
            <Animated.View
              style={{
                transform: [{ rotate: arrowTransform }],
                height: 24,
              }}
            >
              <Feather
                name={theme == "dark" ? "moon" : "sun"}
                size={24}
                color={colors.text}
                onPress={() => toggleListItem()}
              />
            </Animated.View>
          </View>
        </ImageBackground>
        <View style={{ flex: 1, paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
        <TouchableOpacity
          onPress={() => {
            console.log("here");
            dispatch(authActions.logout());
          }}
          style={{ paddingVertical: 15 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="exit-outline" size={22} color={colors.text} />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
                color: colors.text,
              }}
            >
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomDrawer;
