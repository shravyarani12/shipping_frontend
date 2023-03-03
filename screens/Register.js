import React, { useState, useEffect, isValidElement } from 'react'
import { Text, StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback, Button, View, TextInput, Pressable, Image } from 'react-native';
import { Input } from "react-native-elements";
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { initDBConnection, storeHistoryItem, setupDataListener } from "../helpers/fb-history";
import axios from "axios";



import Constants from "expo-constants";
const { manifest } = Constants;


function Register({ route, navigation }) {
    let [state, setState] = useState({
        firstName: null, lastName: null,
        email: '', password: '', phone: ''
    });
    const [message, setMessage] = useState(null);

    let [err, setErr] = useState({ firstName: null, lastName: null, email: null, password: null, phone: null });
    let [error, setError] = useState(null);

    const handleChange = (text, param) => {
        setError(null)
        let error = { ...err };
        let currentState = { ...state }
        //const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        if (text.length != 0) {
            error[param] = null;
        } else {
            error[param] = "Enter correct Values";
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


    const isValid = () => {
        let check = false;

        if (state.firstName.length < 3) {
            setError('First Name cannot be less than 3 characters');
            return false;
        }

        if (state.lastName.length < 3) {
            setError('Last Name cannot be less than 3 characters');
            return false;
        }

        var re = /\S+@\S+\.\S+/;

        if (!re.test(state.email)) {
            setError('Enter email in correct format');
            return false;
        }

        if (state.password.length < 8) {
            setError('password must be minimum 8 characters');
            return false;
        }

        if (state.phone.length != 10) {
            setError('phonenumber must be 10 characters');
            return false;
        }


        return true;
    }
    const register = () => {
        console.log("first")
        if (err.firstName == null && err.lastName == null && err.email == null && err.password == null && err.phone == null
            && state.firstName != null && state.lastName != null && state.email != null && state.password != null && state.phone != null) {

            if (isValid()) {

                //const uri = `http://${manifest.debuggerHost.split(':').shift()}:8080/register`;
                //const uri = `${process.env.ROUTE}/register`
                let uri = 'http://localhost:3000/register';
                //uri='https://shippingbackend.herokuapp.com/register';
                console.log(uri)
                console.log({ ...state })
                axios.post(uri, { ...state }, {
                    "Content-Type": "application/json"
                }).then(res => {
                    console.log(res.data)
                    console.log("New Registration")
                    if (res.status == 200) {
                        clear();
                        setMessage("Registration Succesful");
                        setTimeout(() => {
                            navigation.navigate('Login', {
                                isLogin: null
                            })
                        }, 1500)

                    } else if (res.status == 403) {
                        setState({ email: null, password: null });
                        setErr({ email: null, password: null });
                        setError("Account with this email Id already Exists");
                    }
                    else {
                        navigation.navigate('Register', {
                            isLogin: null
                        })
                    }

                }).catch(err => {
                    if (err.response.status == 403) {
                        setState({ email: null, password: null });
                        setErr({ email: null, password: null });
                        setError("Account with this email Id already Exists");
                    } else {
                        console.log(err);
                        navigation.navigate('Register', {
                            isLogin: null
                        })
                    }
                })
            } else {
                console.log("validation failed")
            }
        } else {
            setError("Fill all fields before Registering");
        }
    }


    useEffect(() => {
        try {
            initDBConnection()
        } catch (err) {
            console.log(err);
        }
    }, [])


    return (
        <SafeAreaView style={styles.container1} >
            <SafeAreaView style={styles.container2}>
                {error != null && <Text style={styles.err}>{error}</Text>}
                <TextInput
                    type="text"
                    style={{
                        height: 40,
                        margin: 12,
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 12
                    }}
                    value={state.firstName}
                    onChangeText={newText => handleChange(newText, "firstName")}
                    placeholder="Enter FirstName"
                />
                {err.firstName != null && <Text style={styles.err}>FirstName cannot be empty</Text>}
                <TextInput
                    type="text"
                    style={{
                        height: 40,
                        margin: 12,
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 12
                    }}
                    value={state.lastName}
                    onChangeText={newText => handleChange(newText, "lastName")}
                    placeholder="Enter LastName"
                />
                {err.lastName != null && <Text style={styles.err}>LastName cannot be empty</Text>}
                <TextInput
                    type="text"
                    style={{
                        height: 40,
                        margin: 12,
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 12
                    }}
                    value={state.phone}
                    onChangeText={newText => handleChange(newText, "phone")}
                    placeholder="Enter PhoneNumber"
                    secureTextEntry={true}
                />
                {err.phone != null && <Text style={styles.err}>Enter valid Phone Number</Text>}
                <TextInput
                    type="text"
                    style={{
                        height: 40,
                        margin: 12,
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 12
                    }}
                    value={state.email}
                    onChangeText={newText => handleChange(newText, "email")}
                    placeholder="Enter Email"
                />
                {err.email != null && <Text style={styles.err}>Enter valid email Id</Text>}
                <TextInput
                    type="text"
                    style={{
                        height: 40,
                        margin: 12,
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 12
                    }}
                    value={state.password}
                    onChangeText={newText => handleChange(newText, "password")}
                    placeholder="Enter Password"
                    secureTextEntry={true}
                />
                {err.password != null && <Text style={styles.err}>Enter password</Text>}
                <View style={{
                    marginVertical: 2, flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                    <Pressable style={styles.button21} onPress={register}>
                        <Text style={styles.buttonText}>Regsiter</Text>
                    </Pressable>
                    <Pressable style={styles.button22} onPress={clear}>
                        <Text style={styles.buttonText}>Clear</Text>
                    </Pressable>
                </View>
                {message != null && <Text style={styles.messageText}>{message}</Text>}
            </SafeAreaView>
        </SafeAreaView>
    )
}

export default Register

const styles = StyleSheet.create({
    input: {
        height: 5,
        margin: 0,
        borderBottomWidth: 0,
        padding: 0,
        fontSize: 15,
        flex: 1
    },
    button: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 8,
        backgroundColor: 'black'

    },
    button21: {
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
    button22: {
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
        fontSize: 12,
        paddingLeft: 5
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },

    messageText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        marginLeft: "30%",
        letterSpacing: 0.25,
        color: 'green'
    },
    buttonHistoryText: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: 'normal',
        letterSpacing: 0.25,
        color: 'black',
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        borderRadius: 20
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
        marginTop: 10,
        flexDirection: "column"
    }
});
