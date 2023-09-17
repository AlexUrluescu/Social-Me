// hooks from react and components ---------------------------------
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";

import { Link } from "expo-router";

// import styled from 'styled-components/native';

// creating lines in the interface ----------------------------------
import Svg, { Line } from "react-native-svg";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom Components -------------------------------------------------
import CustomButton from "../components/CustomButton";
import NavBar from "../components/NavBar";

//
WebBrowser.maybeCompleteAuthSession();

export default function App() {
  let userData = {};
  // useStates ---------------------------------------
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // connection with Google ---------------------------------------------------
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "210894720167-dqrrpe3pkckkr2ktq0306ebdh25ta45h.apps.googleusercontent.com",
    iosClientId: "",
    webClientId:
      "210894720167-1n0sehlr9do7og5unpl4asnjd40o4c0t.apps.googleusercontent.com",
  });

  const [request_fb, response_fb, promptAsync_fb] = Facebook.useAuthRequest({
    clientId: "150415564765489",
  });

  useEffect(() => {
    // THIS IS A TEST FUNCTION WHERE I CAN GET MORE INFO ABOUT THE USER USING FACEBOOK

    // const test_function = async () => {
    //   try {
    //     const res = await fetch("https://graph.facebook.com/v17.0/me?fields=id%2Cname%2Cbirthday%2Cgender%2Chometown%2Cemail%2Cage_range%2Cphotos%2Cposts%2Cvideos%2Clink%2Cfriends&access_token=EAACIzVpOeTEBOxPtBzAfZByFgEGFxjn4MgICTyMkgUTTvMvt7kZCP9Ge3blml62jHWzO7i8WM5c5wVW0ZAQOiA5Vgb5hUtlAmO3DZCg7zSgLpnbbRgAwaZBm31TZC0rXZA6nQkPo6pkoYAhHCnwy7nc6ZCq8iEZAUvlpvk7Kniotyl8nJYHsK3n08PtevLN7Gy5ICMpaBfhrwnWmdzqxVIQ6ZA0Y75BX7naFPMYPEfmC38QjZBlLg74uyeZAdHzQg8cCgAZDZD")
    //     const data = await res.json()

    //     console.log("a trecut");
    //     console.log(data);

    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    // test_function()

    if (
      response_fb &&
      response_fb.type === "success" &&
      response_fb.authentication
    ) {
      (async () => {
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${response_fb.authentication.accessToken}&fields=id,name,picture.type(large)`
        );

        const infoUser = await userInfoResponse.json();
        setUser(infoUser);
        console.log(infoUser);

        console.log(infoUser.picture.data);
        const obiectString = JSON.stringify(infoUser, null, 2);
        console.log(obiectString);
        console.log(obiectString.picture);
        console.log(`Access-token:${response_fb.authentication.accessToken}`);

        // I create a custom object with the name: "userData" where i put the infomation that i want about the user
        // I create this object beacuse when I logging with google or facebook, both services return to me a diferent json
        userData.name = infoUser.name;
        userData.email = "none";
        userData.picture = infoUser.picture.data.url;

        console.log(userData);

        localStorage.setItem("@user", JSON.stringify(userData));
      })();
    }
  }, [response_fb]);

  const handlePressAsync = async () => {
    const result = await promptAsync_fb();
    if (result.type !== "success") {
      alert("something went wrong");
      return;
    }

    console.log(result);
  };

  useEffect(() => {
    const handleEffect = async () => {
      const user = await getLocalUser();
      console.log("user", user);
      if (!user) {
        console.log("new user");
        if (response?.type === "success") {
          console.log("get the new user infomation");
          getUserInfo(response.authentication.accessToken);
        }
      } else {
        console.log("the user is already logged");
        setUser(user);
        console.log("loaded locally");
      }
    };

    handleEffect();
  }, [response, token]);

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      userData.name = user.name;
      userData.email = user.email;
      userData.picture = user.picture;
      await AsyncStorage.setItem("@user", JSON.stringify(userData));

      setUser(user);
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

  // function of the family button ----------------
  const handleFamilyButton = () => {
    console.log("Family");
  };

  // function of the friends button ----------------
  const handleFriendsButton = () => {
    console.log("Friends");
  };

  const handleSignOut = () => {
    localStorage.removeItem("@user");
    setRefresh(!refresh);
  };

  return (
    <View style={styles.container}>
      {localStorage.getItem("@user") ? (
        <View>
          <NavBar userPicture={user?.picture} signOutFunction={handleSignOut} />

          <View style={styles.container_main}>
            <View style={styles.main_name}>
              <Text style={styles.main_text}>{user?.name}</Text>
            </View>

            <View style={styles.container_main_image}>
              <Image
                source={{ uri: user?.picture }}
                style={styles.main_image}
              />
            </View>
            <View style={styles.container_lines}>
              <Svg width="400" height="300">
                <Line
                  x1="180"
                  y1="10" // Punctul de început
                  x2="110"
                  y2="190" // Punctul final
                  stroke="black"
                  strokeWidth="3"
                />
                <Line
                  x1="220"
                  y1="10" // Punctul de început
                  x2="290"
                  y2="190" // Punctul final
                  stroke="black"
                  strokeWidth="3"
                />
              </Svg>
            </View>
            <View style={styles.container_buttons}>
              <View style={styles.container_button}>
                {/* <View style={styles.button}>
                  <Text style={{ fontSize: "25px" }}>+</Text>
                </View> */}
                <CustomButton
                  onPress={handleFamilyButton}
                  style={styles.button}
                  title={<Link href="/addFamily">+</Link>}
                />
                <View>
                  <Text style={{ fontSize: "20px" }}>Add family</Text>
                </View>
              </View>

              <View style={styles.container_button}>
                {/* <View style={styles.button}>
                  <Text style={{ fontSize: "25px" }}>+</Text>
                </View> */}
                <CustomButton
                  onPress={handleFriendsButton}
                  style={styles.button}
                  title={<Link href="/addFriends">+</Link>}
                />
                <View>
                  <Text style={{ fontSize: "20px" }}>Add friends</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>@SocialMe copyrights</Text>
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.title_login_container}>
            <Text style={styles.title_login}>SocialMe</Text>
          </View>
          <View style={styles.signUp_text_container}>
            <Text style={styles.signUp_text}>SingUp</Text>
          </View>
          <View style={styles.buttons_login_container}>
            <TouchableOpacity
              style={styles.google_button}
              onPress={promptAsync}
            >
              <Image
                style={styles.google_buttonImage}
                source={require("../static/google.png")}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.google_button}
              onPress={handlePressAsync}
            >
              <Image
                style={styles.google_buttonImage}
                source={require("../static/facebook.png")}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.google_button}
              onPress={() => console.log("linkedin sign-up")}
            >
              <Image
                style={styles.google_buttonImage}
                source={require("../static/linkedin.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title_login_container: {
    // backgroundColor: "red",
    marginTop: "100px",
    textAlign: "center",
  },

  container: {
    // backgroundColor: "blue",
    fontFamily: "Poppins",
  },

  title_login: {
    fontSize: "50px",
    fontWeight: "bold",
  },

  signUp_text_container: {
    // backgroundColor: "blue",
    textAlign: "center",
    marginTop: "90px",
  },

  signUp_text: {
    fontSize: "30px",
  },

  buttons_login_container: {
    // backgroundColor: "pink",
    marginTop: "50px",

    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },

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

  title: {
    fontSize: "30px",
    fontFamily: "Arial",
  },
  container_main: {
    // backgroundColor: "red",
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },

  container_main_image: {
    // backgroundColor: "green",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  main_image: {
    width: 180,
    height: 180,
    borderRadius: "50%",
  },

  main_name: {
    // backgroundColor: "gray",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "10px",
  },

  main_text: {
    fontSize: "27px",
  },

  footer: {
    textAlign: "center",
  },

  container_lines: {
    // backgroundColor: "yellow",
    height: "200px",
  },

  container_buttons: {
    // backgroundColor: "green",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  container_button: {
    // backgroundColor: "orange",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    width: "90px",
    height: "90px",
    padding: "10px",
    // backgroundColor: "pink",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  google_button: {
    borderRadius: "20px",
    // width: 60,
    // height: 60,
  },
  google_buttonImage: {
    width: 60,
    height: 60,
  },
});
