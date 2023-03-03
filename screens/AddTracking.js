import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback, View, Pressable, Image } from 'react-native';
import { Button, Input } from "react-native-elements";
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather } from '@expo/vector-icons';
import Constants from "expo-constants";
const { manifest } = Constants;
import axios from "axios";
import { random } from 'lodash';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'


const ICONS = {
    open: require('../assets/open.jpg'),
    close: require('../assets/close.jpg'),

};
function AddTracking({ route, navigation }) {
    const [state, setState] = useState({ name: null, trackingNum: null });
    let [err, setErr] = useState({ name: null, trackingNum: null, shippingProvider: null });
    let [error, setError] = useState(null);

    const [open, setOpen] = useState(false);
    const [shippingProvider, setshippingProvider] = useState(null);
    const [items, setItems] = useState([
        { label: 'Fedex', value: 'Fedex' },
        { label: 'Usps', value: 'usps' },
        { label: 'Ups', value: 'ups' },
    ]);


    const clear = () => {
        setState({ name: null, trackingNum: null });
        setErr({ name: null, trackingNum: null });
        setError(null);
    }
    const handleChange = (text, param) => {
        let error = { ...err };
        let currentState = { ...state }
        // const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        if (text.length != 0) {
            error[param] = null;
        } else {
            error[param] = "Enter correct Value";
        }
        currentState[param] = text;
        setErr({ ...error });
        setState({ ...currentState });
    }

    const isValid = () => {
        if (state.name.length < 3) {
            let error = { ...err };
            error["name"] = "Name must be minimum 3 characters";
            setErr({ ...error });
            return false;
        } else if (state.trackingNum.length < 5) {
            let error = { ...err };
            error["trackingNum"] = "Name must be minimum 5 characters";
            setErr({ ...error });
            return false;
        } if (shippingProvider == null) {
            let error = { ...err };
            error["shippingProvider"] = "select one shipping provider";
            setErr({ ...error });
            return false;
        } else {
            return true;
        }
    }

    const save = () => {

        if (err.name == null && err.trackingNum == null && err.shippingProvider == null && state.name != null && state.trackingNum != null && shippingProvider != null) {
            if (isValid()) {
                 //const uri = `http://${manifest.debuggerHost.split(':').shift()}:8080/addShippment`;
                 const uri=`http://localhost:3000/ship/addTracking`;
                //const uri = 'https://shipping-backend.vercel.app/addShippment';
                // uri = 'https://shippingbackend.herokuapp.com/addShippment';
                console.log({ ...state, shippingProvider: shippingProvider })
                console.log({
                    headers: {
                        "authorization": "Bearer " + route.params.token,
                        "content-type": "application/json"
                    }
                })
                axios.post(uri, { ...state, shippingProvider: shippingProvider }, {
                    headers: {
                        "authorization": "Bearer " + route.params.token,
                        "content-type": "application/json"
                    }
                }).then(res => {
                    console.log("New Tracking")
                    console.log(res.data.token)
                    ///props.showForm(false);
                    if (res.status == 200) {
                        let numU = uuidv4();
                        navigation.navigate('Home', {
                            isLogin: "True",
                            added: numU,
                            token: route.params.token
                        })
                    } else if (res.status == 401) {
                        console.log(401)
                        navigation.navigate('Login', {
                            isLogin: null
                        })
                    } else {
                        console.log(500)
                        console.log(res)
                        navigation.navigate('Login', {
                            isLogin: null
                        })
                    }
                }).catch(err => {
                    console.log(err.response.data);
                    console.log(JSON.stringify(err));
                    setError("True")
                    navigation.navigate('Login', {
                        isLogin: null
                    })
                })
            } else {
                console.log("Invalid shipment details")
            }
        }
    }

    return (
        <View>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={styles.container1} >
                    <SafeAreaView style={styles.container2}>
                        <Input
                            type="text"
                            style={styles.input}
                            value={state.name}
                            onChangeText={newText => handleChange(newText, "name")}
                            placeholder="Enter Item Name"
                        />
                        {err.name != null && <Text style={styles.err}>Enter Item Name</Text>}
                        <Input
                            type="text"
                            style={styles.input}
                            value={state.trackingNum}
                            onChangeText={newText => handleChange(newText, "trackingNum")}
                            placeholder="Enter Tracking Number"
                        />
                        <Text style={{ fontSize: 10, paddingBottom: 10, paddingLeft: 10 }}>Enter tracking number starting as FF_ to test notification (Ex: FF_1234)</Text>
                        {err.trackingNum != null && <Text style={styles.err}>Enter tracking number</Text>}

                        <DropDownPicker style={styles.drop}
                            zIndex={3000}
                            zIndexInverse={1000}
                            open={open}
                            value={shippingProvider}
                            items={items}
                            setOpen={setOpen}
                            setValue={setshippingProvider}
                            setItems={setItems}
                            placeholder={"Select Shipping Provider"}
                        />
                        {err.shippingProvider != null && <Text style={styles.err}>Select one Shipping value</Text>}
                        <SafeAreaView style={{ flexDirection: "row", marginBottom: 3 ,justifyContent:"center"}}>
                            <View style={{ flex: 1, }} >
                                <Pressable style={styles.save} onPress={save}>
                                    <Text style={styles.buttonText}>Save</Text>
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
            </TouchableWithoutFeedback>
        </View>
    )
}

export default AddTracking


const styles = StyleSheet.create({
    drop: {
        borderRadius: 0,
        borderTopColor: "white",
        marginBottom: 10,
        fontWeight: 'bold'
    },
    buttonText: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: 'normal',
        letterSpacing: 0.25,
        color: 'white',
        borderRadius:20
    },
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
    save: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
        width:150,
        fontSize: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 20,
        elevation: 3,
        backgroundColor: 'green'
    },
    clear: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 8,
        width:150,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 20,
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
        color: 'black',
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth:1,
        borderRadius:20
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
        flexDirection: "column"
    }
});