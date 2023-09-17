import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

export default function Button({title, onPress}) {
//   const { onPress, title = 'Save' } = props;
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: "25px",
    elevation: 3,
    backgroundColor: 'black',
    width: 60,
    height: 60
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },

  drop_btn: {
    width: "250px",
    height: "250px",
    
    // box-shadow: inset 20px 20px 20px rgba(0, 0, 0, 0.05),
    // 10px 10px 40px rgba(0, 0, 0, 0.05),
    // 10px 30px 30px rgba(0, 0, 0, 0.05),
    // inset -20px -20px 25px rgba(255, 255, 255, 0.9),

    // border-radius: 50%,

    // transition: all ease .5s,

    // display: flex,
    // justify-content: center,
    // align-items: center,
  }
});


// .drop_btn_treshold{
//   /* background-color:  #333; */
//   width: 250px;
//   height: 250px;
//   box-shadow: inset 20px 20px 20px rgba(0, 0, 0, 0.05),
//   10px 10px 40px rgba(0, 0, 0, 0.05),
//   10px 30px 30px rgba(0, 0, 0, 0.05),
//   inset -20px -20px 25px rgba(255, 255, 255, 0.9);

//   border-radius: 50%;

//   transition: all ease .5s;

//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
