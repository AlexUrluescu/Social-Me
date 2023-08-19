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
// import styled from 'styled-components/native';

// creating lines in the interface ----------------------------------
import Svg, { Line } from "react-native-svg";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

// Custom Components -------------------------------------------------
import CustomButton from "../components/CustomButton";

//
WebBrowser.maybeCompleteAuthSession();

// let userData = {
//   name: "",
//   email: "",
//   picture: ""
// }

export default function App() {
  let dataUser = {};
  // useStates ---------------------------------------
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});


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
    // if(localStorage.getItem("user")){
    //   console.log("exista user");
    // }
    // else{
    //   localStorage.setItem("user", JSON.stringify(userData))
    //   console.log(userData);
    // }

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
        console.log(infoUser.picture.data);
        const obiectString = JSON.stringify(infoUser, null, 2);
        console.log(obiectString);
        console.log(obiectString.picture);
        // userData = localStorage.getItem("user")
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

    // setUser(result)

    console.log(result);
  };

  useEffect(() => {
    handleEffect();
  }, [response, token]);

  async function handleEffect() {
    const user = await getLocalUser();
    console.log("user", user);
    if (!user) {
      if (response?.type === "success") {
        getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUser(user);
      console.log("loaded locally");
    }
  }

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

  return (
    <View style={styles.container}>
      {localStorage.getItem("@user") ? (
        <View>
          <View style={styles.header}>
            <View style={styles.container_image}>
              <Image source={{ uri: user?.picture }} style={styles.image} />
            </View>
            <View style={styles.container_title}>
              <Text style={styles.title}>SocialMe</Text>
            </View>
            <View style={styles.container_icon}>
              <TouchableOpacity
                // style={styles.google_button}
                onPress={() => console.log("sign-out")}
              >
                <Icon name="sign-out" size={30} color="#900" />
              </TouchableOpacity>
            </View>
          </View>
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
                  title="+"
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
                  title="+"
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
    backgroundColor: "pink",
    padding: "5px",
    display: "flex",
    flexDirection: "row",
  },
  container_image: {
    width: "20%",
    backgroundColor: "green",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container_title: {
    width: "60%",
    backgroundColor: "orange",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container_icon: {
    backgroundColor: "blue",
    width: "20%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: "20px",
  },
  container_main: {
    backgroundColor: "red",
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },

  container_main_image: {
    backgroundColor: "green",
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
    backgroundColor: "gray",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  main_text: {
    fontSize: "27px",
  },

  footer: {
    textAlign: "center",
  },

  container_lines: {
    backgroundColor: "yellow",
    height: "200px",
  },

  container_buttons: {
    backgroundColor: "green",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  container_button: {
    backgroundColor: "orange",
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
