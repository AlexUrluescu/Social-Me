import React from 'react'
import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

const NavBar2 = () => {
  return (
    <View>
        <Link href='/home'>Home</Link>
        <Link href='/network'>Network</Link>
        <Link href='/login'>Login</Link>
    </View>
  )
}

export default NavBar2