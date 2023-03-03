import React, { useEffect } from 'react';
import { Text, StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import Home from "./screens/Home";
import Register from "./screens/Register";
import Details from "./screens/Details";
import Login from "./screens/Login";
import AddTracking from './screens/AddTracking';
import NewTracking from "./screens/NewTracking";
import registerNNPushToken from 'native-notify';

import Constants from "expo-constants";
const { manifest } = Constants;

//process.env.ROUTE = 'https://shipping-backend.vercel.app';
//process.env.ROUTE = 'https://shippingbackend.herokuapp.com';
process.env.ROUTE = 'http://localhost:3000';
export default function App() {
  //registerNNPushToken(2988, 'KVpPJHcdkZMXyaAsAvsmhz');
  
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen name="Home" component={Home} options={{
          title: 'Home',
          headerStyle: {
            backgroundColor: '#0032a0',
          },

          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}></Stack.Screen>
        <Stack.Screen name="Login" component={Login} options={{
          title: 'Login',
          headerStyle: {
            backgroundColor: '#0032a0',
          },
          headerBackVisible: false,
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}></Stack.Screen>
        <Stack.Screen name="Register" component={Register} options={{
          title: 'Register',
          headerStyle: {
            backgroundColor: '#0032a0',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}></Stack.Screen>

        <Stack.Screen name="Details" component={Details} options={{
          title: 'Details',
          headerStyle: {
            backgroundColor: '#0032a0',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}></Stack.Screen>
        <Stack.Screen name="AddTracking" component={AddTracking} options={{
          title: 'AddTracking',
          headerStyle: {
            backgroundColor: '#0032a0',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    margin: 20,
    flex: 1
  },
});

