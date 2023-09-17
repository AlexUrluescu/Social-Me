import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

// Import the icon librarie
import Icon from "react-native-vector-icons/FontAwesome";

const NavBar = ({ userPicture, signOutFunction }) => {
  return (
    <View style={styles.header}>
      <View style={styles.container_image}>
        <Image source={{ uri: userPicture }} style={styles.image} />
      </View>
      <View style={styles.container_title}>
        <Text style={styles.title}>SocialMe</Text>
      </View>
      <View style={styles.container_icon}>
        <TouchableOpacity onPress={signOutFunction}>
          <Icon name="sign-out" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  header: {
    // backgroundColor: "pink",
    padding: "5px",
    paddingTop: "10px",
    display: "flex",
    flexDirection: "row",
    marginTop: "10px",
  },

  container_image: {
    width: "20%",
    // backgroundColor: "green",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  container_title: {
    width: "60%",
    // backgroundColor: "orange",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  container_icon: {
    // backgroundColor: "blue",
    width: "20%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },

  title: {
    fontSize: "30px",
    fontFamily: "Arial",
  },
});
