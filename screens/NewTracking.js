import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback,View, Pressable, Image } from 'react-native';
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
function NewTracking(props) {
    const [state, setState] = useState({ name: null, trackingNum: null});
    let [err, setErr] = useState({ name: null, trackingNum: null });
    let [error, setError] = useState(null);

    const [open, setOpen] = useState(false);
    const [shipperValue, setShipperValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Fedex', value: 'Fedex' },
        { label: 'Usps', value: 'usps' },
        { label: 'Ups', value: 'ups' },
    ]);


    const clear = () => {
        setState({ name: null, trackingNum: null});
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

    const save = () => {
        if (state.name != null && state.trackingNum != null && shipperValue != null) {
            //const uri = `http://${manifest.debuggerHost.split(':').shift()}:8080/addShippment`;
            const uri='https://shipping-backend.vercel.app/addShippment';
             uri='https://shippingbackend.herokuapp.com/addShippment';
            console.log({ ...state,shipper:shipperValue})
            console.log({headers:{
                "authorization":"Bearer "+props.token,
                "content-type":"application/json"
            }})
            axios.post(uri, { ...state,shipper:shipperValue},{headers:{
                "authorization":"Bearer "+props.token,
                "content-type":"application/json"
            }}).then(res => {
                console.log("New Tracking")
                console.log(res.data.token)
                props.showForm(false);
                if (res.status == 200) {
                    let numU=uuidv4();
                    props.navigation.navigate('Home', {
                        isLogin: "True",
                        added: numU,
                        token: props.token
                    })
                } else if(res.status==401) {
                    console.log(401)
                    props.navigation.navigate('Login', {
                        isLogin: null
                    })
                }else{
                    console.log(500)
                    console.log(res)
                    props.navigation.navigate('Login', {
                        isLogin: null
                    })
                }
            }).catch(err => {
                console.log(err.response.data);
                console.log(JSON.stringify(err));
                setError("True")
                props.navigation.navigate('Login', {
                    isLogin: null
                })
            })
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
                            placeholder="Enter Name"
                        />
                        {err.name != null && <Text style={styles.err}>Enter Name</Text>}
                        <Input
                            type="text"
                            style={styles.input}
                            value={state.trackingNum}
                            onChangeText={newText => handleChange(newText, "trackingNum")}
                            placeholder="Enter Tracking Number"
                        />
                        {err.trackingNum != null && <Text style={styles.err}>Enter tracking number</Text>}

                        <Text style={{ color: "grey" }}>Select Shipping Provider</Text>
                        <DropDownPicker style={styles.drop}
                            zIndex={3000}
                            zIndexInverse={1000}
                            open={open}
                            value={shipperValue}
                            items={items}
                            setOpen={setOpen}
                            setValue={setShipperValue}
                            setItems={setItems}
                        />
                        <View style={{ marginVertical: 2 }}>
                            <Pressable style={styles.button2} onPress={save}>
                                <Text style={styles.buttonText}>Save</Text>
                            </Pressable>
                            <Pressable style={styles.button2} onPress={clear}>
                                <Text style={styles.buttonText}>Clear</Text>
                            </Pressable>
                        </View>
                    </SafeAreaView>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default NewTracking


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
    button2: {
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
        backgroundColor: '#0032a0'
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
        flexDirection: "column"
    }
});