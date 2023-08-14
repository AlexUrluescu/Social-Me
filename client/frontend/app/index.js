import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-web";
import { Link } from "expo-router";
import { useState, useEffect } from "react";

// web: 210894720167-1n0sehlr9do7og5unpl4asnjd40o4c0t.apps.googleusercontent.com
// android: 210894720167-dqrrpe3pkckkr2ktq0306ebdh25ta45h.apps.googleusercontent.com

// ------ components --------------------
import NavBar from "../components/NavBar";

import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  const [userInfo, setUserInfo] = useState(null);
  const [ request, response, promptAsync ] = Google.useAuthRequest({
    androidClientId: "210894720167-dqrrpe3pkckkr2ktq0306ebdh25ta45h.apps.googleusercontent.com",
    webClientId: "210894720167-1n0sehlr9do7og5unpl4asnjd40o4c0t.apps.googleusercontent.com"
  })

  useEffect(() => {
    handleSignInWithGoogle()
  }, [response])

  const handleSignInWithGoogle = async () => {
    const user = await AsyncStorage.getItem("@User")

    if(!user){
      if(response?.type === "success"){
        await getUserInfo(response.authentication.accessToken)
      }
    }
    else{
      setUserInfo(JSON.parse(user))
    }
  }

  const getUserInfo = async (token) => {
    if(!token) return;
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Barer ${token}`}
      })

      const user = await res.json()
      await AsyncStorage.setItem("@user", JSON.stringify(user))
      setUserInfo(user)
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <NavBar />
      <Text>{JSON.stringify(userInfo)}</Text>
      <View style={styles.main}>
       <Button title="Google" onPress={promptAsync}></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
