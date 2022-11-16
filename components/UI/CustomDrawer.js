import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
  ActivityIndicator,
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

const CustomDrawer = (props) => {
  const user = useSelector((state) => state.users.userData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const dispatch = useDispatch();

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
      <View style={styles.centered}>
        <Text>{error}</Text>
        <Button
          title="Try Again"
          onPress={loadUserData}
          color={Colors.backgroundLighter}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
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
                  color: "#fff",
                  fontSize: 18,
                  marginBottom: 5,
                }}
              >
                {user.first_name} {user.last_name}
              </Text>
            </View>
            <View>
              <Feather name="moon" size={24} color={Colors.text} />
            </View>
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
            <Ionicons name="exit-outline" size={22} color={Colors.text} />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
                color: Colors.text,
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
    backgroundColor: Colors.background,
  },
});

export default CustomDrawer;
