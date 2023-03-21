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

import { VStack,Stack, TextInput, IconButton } from "@react-native-material/core";
import DropShipper from './DropShipper';
import FontAwesome5 from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import TxtInput from './TxtInput';
const ICONS = {
    open: require('../assets/open.jpg'),
    close: require('../assets/close.jpg'),

};
function AddTracking({ route, navigation }) {
    const [state, setState] = useState({ name: "", trackingNum: "" });
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
        setState({ name: "", trackingNum: "" });
        setErr({ name: null, trackingNum: null });
        handleDropShipper(null)
        setError(null);
    }
    const handleChange = (text, param) => {
        // let error = { ...err };
        setError(null);
        let currentState = { ...state }
        // const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        // if (text.length != 0) {
        //     error[param] = null;
        // } else {
        //     error[param] = "Enter correct Value";
        // }
        currentState[param] = text;
        // setErr({ ...error });
        setState({ ...currentState });
    }

    const handleDropShipper = (value) => {
        setshippingProvider(value)
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
        console.log(err)
        console.log(state)
        console.log(shippingProvider)
        if (err.name == null && err.trackingNum == null && err.shippingProvider == null && state.name.length > 0 && state.trackingNum.length > 0 && shippingProvider != null) {
            if (isValid()) {
                //const uri = `http://${manifest.debuggerHost.split(':').shift()}:8080/addShippment`;
                const uri = `https://www.shravyarani.com/ship/addTracking`;
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
        } else {
            console.log("Not Valid Details ")
            setError("Invalid Shipping Details")
        }
    }

    return (
        <View>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={styles.container1} >
                    <SafeAreaView style={styles.container2}>
                        <VStack spacing={20} m={12} divider={true}>
                            <Stack spacing={2} style={{ marginBottom: 5, borderRadius: 5 }}>
                                <Text style={{ fontSize: 24, textAlign: "center",  paddingBottom: 5, marginTop: 15, borderRadius: 5,  borderColor: "black" }}>Add Tracking Information</Text>
                            </Stack>
                            {error && <Stack spacing={2} style={{ marginBottom: 5, borderRadius: 5 }}>
                                <Text style={{ fontSize: 14, textAlign: "center",  color: "red", paddingBottom: 15, marginTop: 20,  borderColor: "black" }}>Invalid Tracking Details</Text>
                            </Stack>}
                            <TxtInput handleChange={handleChange} state={state} stateKey={"name"} label={"Enter Item Name*"} />
                            {err.name != null && <Text style={styles.err}>Enter Item Name*</Text>}



                            <TxtInput handleChange={handleChange} state={state} stateKey={"trackingNum"} label={"Enter Tracking Number*"} />
                            {/* <Text style={{ fontSize: 10, paddingBottom: 10, paddingLeft: 10 }}>Enter tracking number starting as FF_ to test notification (Ex: FF_1234)</Text> */}
                            {err.trackingNum != null && <Text style={styles.err}>Enter tracking number</Text>}
   
                            <SafeAreaView style={{ backgroundColor: "#fff", border: "5px", borderColor: "black" }}>
                                <DropShipper handleDropShipper={handleDropShipper} value={shippingProvider}/>
                            </SafeAreaView>
                            {err.shippingProvider != null && <Text style={styles.err}>Select one Shipping value</Text>}
                        </VStack>
                        
                        <SafeAreaView style={{ flexDirection: "row", marginBottom: 3,marginTop:10, justifyContent: "center" }}>
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

    inputContainer: {
        justifyContent: 'center',
    },
    input: {
        height: 50,
    },
    icon: {
        position: 'absolute',
        right: 10,
    },


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
        borderRadius: 20
    },
    // input: {
    //     height: 5,
    //     margin: 0,
    //     borderBottomWidth: 0,
    //     padding: 0,
    //     fontSize: 15,
    //     flex: 1
    // },
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
        width: 150,
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
        width: 150,
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
        flexDirection: "column"
    }
});