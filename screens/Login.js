import React, { useState, useEffect, useCallback } from 'react'
import { Text, StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback, ImageBackground, View, Pressable, Image, Alert, TextInput } from 'react-native';
import { Button, Input } from "react-native-elements";
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { initDBConnection, setupDataProfileListener } from "../helpers/fb-history"
const ICONS = {
    logo: require('../assets/logo.jpg'),
    loading: require('../assets/loading.gif'),
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
    const [loading, setLoading] = useState(null);

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


    const isValid = () => {
        var re = /\S+@\S+\.\S+/;
        console.log(state)
        if (!re.test(state.email)) {
            let error = { ...err };
            error["email"] = "Enter email in correct format";
            setErr({ ...error });
            return false;
        } else if (state.password.length < 8) {
            let error = { ...err };
            error["password"] = "password must be minimum 8 characters";
            setErr({ ...error });
            return false;
        } else {
            return true;
        }


    }

    const login = async () => {

        if (err.email == null && err.password == null && state.email != null && state.password != null) {
            if (isValid()) {
                console.log("third")
                setLoading(true)
                setTimeout(async () => {
                   /* This will be used  later on for notifications
                    let expoToken = await registerForPushNotificationsAsync();
                   */
                   
                    //const uri = `${process.env.ROUTE}/login`;
                    let uri = 'http://localhost:3000/login';
                    //axios.post(uri, { ...state, expoToken: expoToken }).then(res => {
                    axios.post(uri, { ...state}).then(res => {
                        console.log(res.data.token)
                        console.log("uid:" + res.data.uId);
                        //registerIndieID(res.data.uId, 2988, 'KVpPJHcdkZMXyaAsAvsmhz');
                        setLoading(null);
                        if (res.status == 200) {
                            navigation.navigate('Home', {
                                isLogin: "True",
                                token: res.data.token,
                                uId: res.data.uId
                            })
                        }
                        else {
                            setLoading(null);
                            navigation.navigate('Register', {
                                isLogin: null
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                        setLoading(null);
                        setError("True")
                    })
                }, 500)

            } else {
                console.log("Invalid Form")
                setLoading(null);
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
                    <View style={{ backgroundColor: "green", borderRadius: 20, marginTop: 10 }}>
                        <Text style={styles.buttonHistoryText}>Register</Text>
                    </View>
                </TouchableOpacity>
            ),
            headerLeft: () => null
        })

    });
    return (

        <SafeAreaView style={styles.container1} >
            <View style={{ fontSize: 16, fontWeight: 'bold', marginTop: 15, display: "flex", flexDirection: "row" }}>
                <Image
                    style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 0, marginLeft: 10 }}
                    source={ICONS['logo']}
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 35, marginLeft: 5, textAlign: "center" }}>
                    Personal Shipping Assistant
                </Text>
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ zIndex: 2,position:"absolute",width:"100%" }} >
                    <View>
                        {error != null && <Text style={styles.err}>Please enter correct email and Password</Text>}
                        <TextInput
                            type="text"
                            style={{
                                height: 40,
                                margin: 12,
                                borderWidth: 1,
                                padding: 10,
                                borderRadius: 10,
                                borderWidth: 2
                            }}
                            value={state.email}
                            onChangeText={newText => handleChange(newText, "email")}
                            placeholder="Enter email"
                            textContentType={'emailAddress'}
                        />
                        {err.email != null && <Text style={styles.err}>Enter valid email ID</Text>}
                        <TextInput
                            type="text"
                            style={{
                                height: 40,
                                margin: 12,
                                borderWidth: 1,
                                padding: 10,
                                borderRadius: 10,
                                borderWidth: 2

                            }}
                            value={state.password}
                            onChangeText={newText => handleChange(newText, "password")}
                            placeholder="Enter Password"
                            secureTextEntry={true}
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



                    </View>
                </View>

                <View style={{ zIndex: 3,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        }}>
                    {loading && <Image
                        style={{alignSelf:"center",width:50,height:50,marginTop:50  }}
                        source={ICONS['loading']}
                    />}
                </View>
            </View>





        </SafeAreaView>
    )
}

export default Login

const styles = StyleSheet.create({
    container1: {
        backgroundColor: "white",
        margin: 0,
        flex: 1
    },
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
        backgroundColor: 'green',
        borderRadius: 10
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
        backgroundColor: 'red',
        borderRadius: 10
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
        fontWeight: "bold",
        lineHeight: 21,
        letterSpacing: 0.25,
        color: 'white',
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 20,
        paddingTop: 5,
        paddingBottom: 5
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
        marginLeft: "10%",
        marginRight: "10%",
    },
    container3: {
        zIndex: 2,
        elevation: 50,
        marginTop: "10%",
        marginLeft: "10%",
        marginRight: "10%",
    }
});
