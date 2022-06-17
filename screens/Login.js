import React, { useState, useEffect, useCallback } from 'react'
import { Text, StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback, View, Pressable, Image, Alert } from 'react-native';
import { Button, Input } from "react-native-elements";
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { initDBConnection, setupDataProfileListener } from "../helpers/fb-history"
const ICONS = {
    logo: require('../assets/logo.jpg'),
};
import axios from "axios";
import { registerIndieID } from 'native-notify';
import Constants from "expo-constants";
const { manifest } = Constants;
import * as Notifications from 'expo-notifications';

async function registerForPushNotificationsAsync() {
    let token;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);

    return token;
}






function Login({ route, navigation }) {
    let [state, setState] = useState({
        email: '', password: ''
    });

    let [err, setErr] = useState({ email: null, password: null });
    let [error, setError] = useState(null);

    const handleChange = (text, param) => {
        setError(null)
        let error = { ...err };
        let currentState = { ...state }
        //const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        if (text.length != 0) {
            error[param] = null;
        } else {
            error[param] = "Enter numeric";
        }
        currentState[param] = text;
        setErr({ ...error });
        setState({ ...currentState });
    }

    const clear = () => {
        setState({ email: null, password: null });
        setErr({ email: null, password: null });
        setError(null);
    }


    const alert = (message) => {
        Alert.alert(
            "Invalid Details",
            message,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }


    const execute = useCallback(() => {
        if (route.params?.token == null) {
            navigation.navigate('Login', {
            })
        }
    }, [])


    useEffect(() => {
        execute();
    }, [execute])


const isValid=()=>{
    var re = /\S+@\S+\.\S+/;
       console.log(state)
    if(!re.test(state.email)){
        let error = { ...err };
        error["email"] = "Enter email in correct format";
        setErr({ ...error });
        return false;
    }else if(state.password.length<8){
        let error = { ...err };
        error["password"] = "password must be minimum 8 characters";
        setErr({ ...error });
        return false;
    }else{
        return true;
    }

    
}

    const login = async () => {
        if (err.email == null && err.password == null && state.email != null && state.password != null) {
            if (isValid()) {
                console.log("third")
                let expoToken = await registerForPushNotificationsAsync();
                //const uri = `http://${manifest.debuggerHost.split(':').shift()}:8080/login`;
                const uri=`${process.env.ROUTE}/login`
                //const uri='https://shipping-backend.vercel.app/login';
                 //uri='https://shippingbackend.herokuapp.com/login';
                axios.post(uri, { ...state, expoToken: expoToken }).then(res => {
                    console.log(res.data.token)
                    console.log("uid:" + res.data.uId);
                    //registerIndieID(res.data.uId, 2988, 'KVpPJHcdkZMXyaAsAvsmhz');
                    if (res.status == 200) {
                        navigation.navigate('Home', {
                            isLogin: "True",
                            token: res.data.token,
                            uId: res.data.uId
                        })
                    }
                    else {
                        navigation.navigate('Register', {
                            isLogin: null
                        })
                    }
                }).catch(err => {
                    console.log(err);
                    setError("True")
                })
            } else {
                console.log("Invalid Form")
            }

        }
    }

    useEffect(() => {
        try {
            initDBConnection()
        } catch (err) {
            console.log(err);
        }
    }, [])


    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ paddingRight: 15 }}
                    onPress={() => {
                        navigation.navigate('Register', {
                        })
                    }}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            )

        })

    });
    return (
        <SafeAreaView style={styles.container1} >
            <View style={styles.weatherView}>
                <Image
                    style={{ width: 80, height: 80, marginLeft: "37%", borderRadius: 50, borderWidth: 0 }}
                    source={ICONS['logo']}
                />
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 15, marginLeft: "25%" }}>
                    Personal Shipping Tracker
                </Text>
            </View>
            <SafeAreaView style={styles.container2}>
                {error != null && <Text style={styles.err}>Please enter correct email and Password</Text>}
                <Input
                    type="text"
                    style={styles.input}
                    value={state.email}
                    onChangeText={newText => handleChange(newText, "email")}
                    placeholder="Enter email"
                />
                {err.email != null && <Text style={styles.err}>email cannot be empty</Text>}
                <Input
                    type="text"
                    style={styles.input}
                    value={state.password}
                    onChangeText={newText => handleChange(newText, "password")}
                    placeholder="Enter Password"
                />
                {err.password != null && <Text style={styles.err}>Enter password</Text>}

                <SafeAreaView style={{ flexDirection: "row", marginBottom: 3 }}>
                    <View style={{ flex: 1, }} >
                        <Pressable style={styles.login} onPress={login}>
                            <Text style={styles.buttonText}>Login</Text>
                        </Pressable>
                    </View>
                    <View style={{ flex: 1, }} >
                        <Pressable style={styles.clear} onPress={clear}>
                            <Text style={styles.buttonText}>Clear</Text>
                        </Pressable>
                    </View>
                </SafeAreaView>

            </SafeAreaView>
        </SafeAreaView>
    )
}

export default Login

const styles = StyleSheet.create({
    input: {
        height: 5,
        margin: 2,
        borderWidth: 2,
        padding: 5,
        fontSize: 15,
        flex: 1
    },
    back: {
        display: 'none'
    },
    button: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 8,
        backgroundColor: 'black'

    },
    login: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'green'
    },
    clear: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'red'
    },
    err: {
        color: "red",
        fontSize: 10
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    buttonHistoryText: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: 'normal',
        letterSpacing: 0.25,
        color: 'white',
        paddingLeft: 10
    },

    textResult: {
        flex: 1, textAlign: "left", borderWidth: 1,
        borderColor: 'black',
        borderRadius: 0,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        fontWeight: "bold",
        fontSize: 18
    },
    container2: {
        marginTop: "10%",
        flexDirection: "column",
        marginLeft: "10%",
        marginRight: "10%",
    }
});
