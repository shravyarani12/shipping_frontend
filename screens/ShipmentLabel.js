import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback, View, Pressable, Image } from 'react-native';
import { Button, Input } from "react-native-elements";
import DropDownPicker from 'react-native-dropdown-picker';
DropDownPicker.setListMode("SCROLLVIEW");
import { Feather } from '@expo/vector-icons';
import Constants from "expo-constants";
const { manifest } = Constants;
import axios from "axios";
import { random } from 'lodash';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'

import DropD from "./DropD";


import { Stack, TextInput, IconButton, FAB } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import TxtInput from './TxtInput';
import RatesList from './RatesList';

import Modal from "react-native-modal";


import { TouchableOpacity } from 'react-native-gesture-handler';


const ICONS = {
    open: require('../assets/open.jpg'),
    close: require('../assets/close.jpg'),

};
const addressDefaultValue = {
    "name": "",
    "street1": "",
    "street2": "",
    "city": "",
    "state": "",
    "zip": "",
    "country": "",
    "savedb": "false"
};


const addressToDefaultValue = {
    "name": "Shravya Rani",
    "street1": "8300 old kings rd s",
    "street2": "Apt 99",
    "city": "Jacksonville",
    "state": "FL",
    "zip": "32217",
    "country": "US",
    "savedb": "false"
};

const addressFromDefaultValue = {
    "name": "Secondary",
    "street1": "706 Stampede Ln",
    "street2": "",
    "city": "Princeton",
    "state": "TX",
    "zip": "75407",
    "country": "US",
    "savedb": "false"
};


const addressErrDefaultValue = {
    "name": null,
    "street1": null,
    "street2": null,
    "city": null,
    "state": null,
    "zip": null,
    "country": null,
};

const parcelDefaultValue = {
    "length": "11",
    "width": "11",
    "height": "11",
    "distance_unit": "in",
    "weight": "11",
    "mass_unit": "lb",
    "name": "Amazon",
    "savedb": "false"
};
// const parcelDefaultValue = {
//     "length": "",
//     "width": "",
//     "height": "",
//     "distance_unit": "in",
//     "weight": "",
//     "mass_unit": "lb",
//     "name": "",
//     "savedb": "false"
// };


const parcelErrValue = {
    "name": null,
    "length": null,
    "width": null,
    "height": null,
    "weight": null
};
function ShipmentLabel({ route, navigation }) {

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ paddingRight: 10 }}
                    onPress={() => {
                        navigation.navigate('Login', {
                            token: null
                        })
                    }}
                >
                    <View style={{ backgroundColor: "black", borderRadius: 20, }}>
                        <Text style={styles.buttonHistoryText}>Sign Out</Text>
                    </View>

                </TouchableOpacity>
            ),
            headerLeft: () => (
                <TouchableOpacity style={{ paddingRight: 10 }}
                    onPress={() => {
                        navigation.navigate('Home', {
                            isLogin: "True",
                            uId: route.params.uId,
                            token: route.params.token
                        })
                    }}
                >
                    <View style={{ backgroundColor: "black", borderRadius: 20, }}>
                        <Text style={styles.buttonHistoryText}>Home</Text>
                    </View>
                </TouchableOpacity>
            )
        })
    });


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

    const [next, setNext] = useState(1);

    const [toAddress, setToAddress] = useState({ ...addressToDefaultValue })
    const [toerr, setToErr] = useState({ ...addressErrDefaultValue });

    const [fromAddress, setFromAddress] = useState({ ...addressFromDefaultValue })
    const [fromerr, setFromErr] = useState({ ...addressErrDefaultValue });


    const [parcel, setParcel] = useState({ ...parcelDefaultValue })
    const [parcelerr, setParcelErr] = useState({ ...parcelErrValue });


    const [apiErr, setApiErr] = useState({ toAddress: null, fromAddress: null, parcel: null });
    const [apiErrDesc, setApiErrDesc] = useState({ toAddress: null, fromAddress: null, parcel: null });

    const [ratesErr, setRatesErr] = useState("false");

    const [ratesList, setRatesList] = useState([]);

    const [isLoading, setIsLoading] = useState(false);


    const clear = () => {
        setState({ name: null, trackingNum: null });
        setErr({ name: null, trackingNum: null });
        setError(null);
    }


    const clearToAddress = () => {
        setToAddress({ ...addressDefaultValue });
        setToErr({ ...addressErrDefaultValue });
        setError(null);
        setApiErr({ ...apiErr, toAddress: null })
    }

    const clearFromAddress = () => {
        setFromAddress({ ...addressDefaultValue });
        setFromErr({ ...addressErrDefaultValue });
        setError(null);
        setApiErr({ ...apiErr, fromAddress: null })
    }


    const clearParcel = () => {
        setParcel({ ...parcelDefaultValue });
        setParcelErr({ ...parcelErrValue });
        setError(null);
        setApiErr({ ...apiErr, parcel: null })
    }


    const handleToAddressChange = (text, param, add = "to") => {
        setApiErr({ ...apiErr, toAddress: null })
        setApiErrDesc({ ...apiErr, toAddress: null })
        let error = "";
        let currentState = ""

        error = { ...toerr };
        currentState = { ...toAddress };
        // const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        // if (text.length != 0) {
        //     error[param] = null;
        // } else {
        //     error[param] = "Enter correct Value";
        // }
        // currentState[param] = text;
        if(param=="zip"){
            let numberRegex = /^\d+$/;
            if(numberRegex.test(text)){
                currentState[param] = text;
            }

        }else{
            currentState[param] = text;
        }

        setToErr({ ...error });
        setToAddress({ ...currentState });
    }

    const handleFromAddressChange = (text, param, add = "from") => {
        setApiErr({ ...apiErr, fromAddress: null })
        setApiErrDesc({ ...apiErr, fromAddress: null })
        let error = "";
        let currentState = ""

        error = { ...fromerr };
        currentState = { ...fromAddress };
        // const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        // if (text.length != 0) {
        //     error[param] = null;
        // } else {
        //     error[param] = "Enter correct Value";
        // }
        if(param=="zip"){
            let numberRegex = /^\d+$/;
            if(numberRegex.test(text)){
                currentState[param] = text;
            }

        }else{
            currentState[param] = text;
        }
        setFromErr({ ...error });
        setFromAddress({ ...currentState });
    }


    const handleParcelChange = (text, param) => {
        setApiErr({ ...apiErr, parcel: null })
        setApiErrDesc({ ...apiErr, parcel: null })
        let error = "";
        let currentState = ""

        error = { ...parcelerr };
        currentState = { ...parcel };
        const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        if (param == "name") {
            currentState[param] = text;
            setParcel({ ...currentState });
        }
        if (text !== "name" && (floatRegExp.test(text) || text == "")) {
            currentState[param] = text;
            setParcel({ ...currentState });
        }
    }
    // if ((param == "name" && text.length > 0) || (param != "name" && parseFloat(text) > 0)) {
    //     error[param] = null;
    // } else {
    //     error[param] = "Enter correct Value";
    // }


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

    const isAddressValid = (dir) => {
        let numberRegex = /^\d+$/;
        let address = dir == "to" ? { ...toAddress } : { ...fromAddress };
        if (address.name.length < 3) {
            let error = { ...toerr };
            error["name"] = "Name must be minimum 3 characters";
            dir == "to" ? setToErr({ ...error }) : setFromErr({ ...error });
            return false;
        } else if (address.street1.length < 5) {
            let error = { ...toerr };
            error["street1"] = "Address Line 1 must be atleast 5 characters";
            dir == "to" ? setToErr({ ...error }) : setFromErr({ ...error });
            return false;
        } else if (address.state.length < 1) {
            let error = { ...toerr };
            error["state"] = "State must be selected";
            dir == "to" ? setToErr({ ...error }) : setFromErr({ ...error });
            return false;
        }
        else if (address.city.length < 3) {
            let error = { ...toerr };
            error["city"] = "City must be atleast 3 characters";
            dir == "to" ? setToErr({ ...error }) : setFromErr({ ...error });
            return false;
        }
        else if (address.country.length < 2) {
            let error = { ...toerr };
            error["country"] = "Country must be atleast 5 characters";
            dir == "to" ? setToErr({ ...error }) : setFromErr({ ...error });
            return false;
        }
        else if (address.zip.length !=5 || !(numberRegex.test(address.zip))) {
            let error = { ...toerr };
            error["zip"] = "Zip code should be 5 digit characters only";
            dir == "to" ? setToErr({ ...error }) : setFromErr({ ...error });
            return false;
        }
        else {
            return true;
        }
    }

    const isParcelValid = () => {
        if (parcel.name.length < 3) {
            let error = { ...toerr };
            error["name"] = "Name must be minimum 3 characters";
            setParcelErr({ ...error });
            return false;
        } else if (parseFloat(parcel["length"]) <= 0) {
            let error = { ...toerr };
            error["length"] = "Length should be Greater than 0";
            setParcelErr({ ...error });
            return false;
        } else {
            return true;
        }
    }


    const validateAddress = (dir, savedb = "false", isLoadingStatus = false) => {
        setIsLoading(true);
        dir == "to" ? setApiErr({ ...apiErr, toAddress: null }) : setApiErr({ ...apiErr, fromAddress: null })
        return new Promise((resolve, reject) => {

            let address = dir == "to" ? toAddress : fromAddress;
            let errObj = dir == "to" ? toerr : fromerr;
            if (Object.keys(errObj).filter(item => toerr[item]).length == 0) {
                if (isAddressValid(dir)) {
                    const uri = `https://cis693-backend.vercel.app/ship/addAddress`;
                    axios.post(uri, { ...address, savedb: savedb }, {
                        headers: {
                            "authorization": "Bearer " + route.params.token,
                            "content-type": "application/json"
                        }
                    }).then(res => {
                        console.log("Valid Address Resp")
                        if (res.status == 200) {
                            setIsLoading(isLoadingStatus);
                            return resolve(res.data)

                        } else {
                            dir == "to" ? setApiErr({ ...apiErr, toAddress: "error" }) : setApiErr({ ...apiErr, fromAddress: "error" })
                            setIsLoading(false);
                            return reject("")
                        }
                    }).catch(err => {
                        console.log("Add Err")
                        console.log(err)

                        if (err.response.status != 400) {
                            navigation.navigate('Login', {
                                isLogin: null
                            })
                        } else {
                            let error = (err.response.data && err.response.data.error) ? err.response.data.error : err.response.data
                            dir == "to" ? setApiErr({ ...apiErr, toAddress: "error" }) : setApiErr({ ...apiErr, fromAddress: "error" })
                            dir == "to" ? setApiErrDesc({ ...apiErr, toAddress: error }) : setApiErrDesc({ ...apiErr, fromAddress: error })
                            setIsLoading(false);
                        }

                        return reject("")
                    })
                } else {
                    dir == "to" ? setApiErr({ ...apiErr, toAddress: "error" }) : setApiErr({ ...apiErr, fromAddress: "error" })
                    setIsLoading(false);
                    return reject("")
                }
            } else {
                dir == "to" ? setApiErr({ ...apiErr, toAddress: "error" }) : setApiErr({ ...apiErr, fromAddress: "error" })
                setIsLoading(false);
                return reject("")
            }
        });
    }


    const validateParcel = (savedb = "false") => {
        setApiErr({ ...apiErr, parcel: null })
        return new Promise((resolve, reject) => {
            if (Object.keys(parcelerr).filter(item => toerr[item]).length == 0) {
                if (isParcelValid()) {
                    const uri = `https://cis693-backend.vercel.app/ship/addParcel`;
                    axios.post(uri, { ...parcel, savedb: savedb }, {
                        headers: {
                            "authorization": "Bearer " + route.params.token,
                            "content-type": "application/json"
                        }
                    }).then(res => {
                        console.log("Valid Parcel Resp")
                        if (res.status == 200) {
                            console.log(res)
                            return resolve(res.data)
                        } else {
                            console.log(res)
                            setApiErr({ ...apiErr, parcel: "error" })
                            return reject("")
                        }
                    }).catch(err => {
                        console.log("InValid Parcel Resp")
                        console.log(JSON.stringify(err));
                        if (err.response.status != 400) {
                            navigation.navigate('Login', {
                                isLogin: null
                            })
                        } else {
                            setApiErr({ ...apiErr, parcel: "error" })
                        }
                        return reject("")
                    })
                } else {
                    console.log("Invalid parcel details")
                    setApiErr({ ...apiErr, parcel: "error" })
                    return reject("")
                }
            } else {
                console.log("Invalid")
                setApiErr({ ...apiErr, parcel: "error" })
                return reject("")
            }
        })

    }

    const isFromAddressValid = () => {

    }

    const save = () => {
        setIsLoading(true);
        setRatesErr("false");
        Promise.all([validateAddress("to", "true", true), validateAddress("from", "true", true), validateParcel("true")]).then(async (values) => {
            console.log((values))
            try {
                if (Object.keys(apiErr).filter(item => toerr[item]).length == 0) {
                    const uri = `https://cis693-backend.vercel.app/ship/createShipment`;
                    axios.post(uri, { addressTo: values[0].addressId, addressFrom: values[1].addressId, parcels: values[2].parcelId, name: toAddress.name + "-" + fromAddress.name + "-" + parcel.name }, {
                        headers: {
                            "authorization": "Bearer " + route.params.token,
                            "content-type": "application/json"
                        }
                    }).then(res => {
                        console.log("New Shipment Created")
                        if (res.status == 200) {
                            console.log(res.data)
                            const uri = `https://cis693-backend.vercel.app/ship/getRates?shipmentId=` + res.data.shipmentId;

                            axios.get(uri, {
                                headers: {
                                    "authorization": "Bearer " + route.params.token,
                                    "content-type": "application/json"
                                }
                            }).then(res => {
                                console.log("New Rates Available")
                                if (res.status == 200) {
                                    console.log(res.data)
                                    setRatesList(res.data.carriers.results);
                                    setNext(4)
                                    // setIsLoading(false);
                                } else {
                                    setRatesErr("true");
                                    setIsLoading(false);
                                }
                            }).catch(err => {
                                console.log("Error in Rates API")
                                console.log(err)
                                setRatesErr("true");
                                setIsLoading(false);
                            })
                        } else {
                            console.log(res.status)
                            setRatesErr("true")
                            setIsLoading(false);
                        }
                    }).catch(err => {
                        console.log(err);
                        setRatesErr("true");
                        setIsLoading(false);
                    })
                } else {
                    setRatesErr("true");
                    setIsLoading(false);
                }
            } catch (err) {
                console.log(err);
                setRatesErr("true");
                setIsLoading(false);
            }
        }).catch(err => {
            console.log("Promise Failed")
            console.log(err)
            setRatesErr("true");
            setIsLoading(false);
        });

    }



    return (
        <View>
            {isLoading && <Modal isVisible={isLoading}
                backdropColor={"#B4B3DB"}
                backdropOpacity={0.8}
                animationIn={"zoomInDown"}
                animationOut={"zoomOutUp"}
                animationInTiming={600}
                animationOutTiming={600}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}>
                <Stack fill center spacing={4}>
                    <FAB
                        icon={props => <Icon name="plus" {...props} />}
                        color="primary"
                        loading
                    />
                </Stack>
            </Modal>}




            {next == 1 && <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={styles.container1} >
                    <Stack spacing={4} style={{ margin: 16 }}>

                        <Stack spacing={2} style={{ marginBottom: 5, borderRadius: 5 }}>
                            <Text style={{ fontSize: 24, textAlign: "center", textDecoration: "underline", fontFamily: "ui-sans-serif", paddingBottom: 15, marginTop: 20, borderRadius: 5, border: 20, borderColor: "black" }}>SHIPS TO</Text>
                        </Stack>

                        {apiErr.toAddress != null && <Text style={styles.err}>Invalid To Address , Update them </Text>}
                        {apiErrDesc.toAddress != null && <Text style={styles.err}>{apiErrDesc.toAddress} </Text>}
                        <TxtInput handleChange={handleToAddressChange} state={toAddress} stateKey={"name"} label={"Enter Name for this address*"} />
                        {toerr.name != null && <Text style={styles.err}>Enter Name for this Address</Text>}

                        <TxtInput handleChange={handleToAddressChange} state={toAddress} stateKey={"street1"} label={"Address Line 1*"} />
                        {toerr.street1 != null && <Text style={styles.err}>Enter Valid Street1</Text>}

                        <TxtInput handleChange={handleToAddressChange} state={toAddress} stateKey={"street2"} label={"Address Line 2"} />
                        {toerr.street2 != null && <Text style={styles.err}>Enter Valid Street2</Text>}

                        <TxtInput handleChange={handleToAddressChange} state={toAddress} stateKey={"city"} label={"City*"} />
                        {toerr.city != null && <Text style={styles.err}>Enter Valid City</Text>}

                        <SafeAreaView style={{ backgroundColor: "#fff", border: "5px", borderColor: "black" }}>
                            <DropD handleToAddressChange={handleToAddressChange} add="to" value={toAddress.state} />
                        </SafeAreaView>
                        {toerr.state != null && <Text style={styles.err}>Enter Valid State</Text>}

                        <TxtInput handleChange={handleToAddressChange} state={toAddress} stateKey={"country"} label={"Country*"} />
                        {toerr.country != null && <Text style={styles.err}>Enter Valid Country</Text>}

                        <TxtInput handleChange={handleToAddressChange} state={toAddress} stateKey={"zip"} label={"Zip*"} />
                        {toerr.zip != null && <Text style={styles.err}>Enter Valid Zip</Text>}

                    </Stack>
                    <SafeAreaView style={{ flexDirection: "row", marginBottom: 3, justifyContent: "center" }}>
                        <View style={{ flex: 1, }} >
                            <Pressable style={styles.save} onPress={() => {
                                validateAddress("to").then((res) => {
                                    setNext(2)
                                })
                            }}>
                                <Text style={styles.buttonText}>Save and Next</Text>
                            </Pressable>
                        </View>
                        <View style={{ flex: 1, }} >
                            <Pressable style={styles.clear} onPress={clearToAddress}>
                                <Text style={styles.buttonText}>Clear</Text>
                            </Pressable>
                        </View>
                    </SafeAreaView>
                </SafeAreaView>
            </TouchableWithoutFeedback>

            }
            {next == 2 &&
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    <SafeAreaView style={styles.container1} >
                        <Stack spacing={4} style={{ margin: 16 }}>

                            <Stack spacing={2} style={{ marginBottom: 5, borderRadius: 5 }}>
                                <Text style={{ fontSize: 24, textAlign: "center", fontFamily: "ui-sans-serif", textDecoration: "underline", paddingBottom: 15, marginTop: 20, borderRadius: 5, border: 20, borderColor: "black" }}>SHIPS FROM</Text>
                            </Stack>

                            {apiErr.fromAddress != null && <Text style={styles.err}>Invalid From Address , Update them </Text>}
                            {apiErrDesc.fromAddress != null && <Text style={styles.err}>{apiErrDesc.fromAddress} </Text>}

                            <TxtInput handleChange={handleFromAddressChange} state={fromAddress} stateKey={"name"} label={"Enter Name for this address*"} />
                            {fromerr.name != null && <Text style={styles.err}>Enter Name for this Address</Text>}

                            <TxtInput handleChange={handleFromAddressChange} state={fromAddress} stateKey={"street1"} label={"Address Line 1*"} />
                            {fromerr.street1 != null && <Text style={styles.err}>Enter Valid Street1</Text>}

                            <TxtInput handleChange={handleFromAddressChange} state={fromAddress} stateKey={"street2"} label={"Address Line 2"} />
                            {fromerr.street2 != null && <Text style={styles.err}>Enter Valid Street2</Text>}

                            <TxtInput handleChange={handleFromAddressChange} state={fromAddress} stateKey={"city"} label={"City*"} />
                            {fromerr.city != null && <Text style={styles.err}>Enter Valid City</Text>}

                            <SafeAreaView style={{ backgroundColor: "#fff", border: "5px", borderColor: "black" }}>
                                <DropD handleToAddressChange={handleFromAddressChange} add="to" value={fromAddress.state} />
                            </SafeAreaView>
                            {fromerr.state != null && <Text style={styles.err}>Enter Valid State</Text>}

                            <TxtInput handleChange={handleFromAddressChange} state={fromAddress} stateKey={"country"} label={"Country*"} />
                            {fromerr.country != null && <Text style={styles.err}>Enter Valid Country</Text>}

                            <TxtInput handleChange={handleFromAddressChange} state={fromAddress} stateKey={"zip"} label={"Zip*"} />
                            {fromerr.zip != null && <Text style={styles.err}>Enter Valid Zip</Text>}
                        </Stack>

                        <SafeAreaView style={{ flexDirection: "row", marginBottom: 3, justifyContent: "center" }}>
                            <View style={{ flex: 1, }} >
                                <Pressable style={styles.save} onPress={() => {
                                    validateAddress("from").then((res) => {
                                        setNext(3)
                                    })
                                }}>
                                    <Text style={styles.buttonText}>Save and Next</Text>
                                </Pressable>
                            </View>
                            <View style={{ flex: 1, }} >
                                <Pressable style={styles.clear} onPress={clearFromAddress}>
                                    <Text style={styles.buttonText}>Clear</Text>
                                </Pressable>
                            </View>
                        </SafeAreaView>
                    </SafeAreaView>
                </TouchableWithoutFeedback>

            }

            {next == 3 &&
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    <SafeAreaView style={styles.container1} >
                        <Stack spacing={4} style={{ margin: 16 }}>

                            <Stack spacing={2} style={{ marginBottom: 5, borderRadius: 5 }}>
                                <Text style={{ fontSize: 24, textAlign: "center", textDecoration: "underline", fontFamily: "ui-sans-serif", paddingBottom: 15, marginTop: 20, borderRadius: 5, border: 20, borderColor: "black" }}>Parcel Dimensions</Text>
                            </Stack>

                            {apiErr.parcel != null && <Text style={styles.err}>Invalid To Parcel Dimensions , Update them </Text>}

                            <TxtInput handleChange={handleParcelChange} state={parcel} stateKey={"name"} label={"Enter Name for this Parcel*"} />
                            {parcelerr.name != null && <Text style={styles.err}>Enter Name for this Parcel</Text>}

                            <TxtInput handleChange={handleParcelChange} state={parcel} stateKey={"length"} label={"Length in Inches*"} />
                            {parcelerr.length != null && <Text style={styles.err}>Enter Valid Length</Text>}

                            <TxtInput handleChange={handleParcelChange} state={parcel} stateKey={"width"} label={"Width in Inches*"} />
                            {parcelerr.width != null && <Text style={styles.err}>Enter Valid Width</Text>}

                            <TxtInput handleChange={handleParcelChange} state={parcel} stateKey={"height"} label={"Height in Inches*"} />
                            {parcelerr.height != null && <Text style={styles.err}>Enter Valid Height</Text>}

                            <TxtInput handleChange={handleParcelChange} state={parcel} stateKey={"weight"} label={"Weight in Lbs*"} />
                            {parcelerr.weight != null && <Text style={styles.err}>Enter Valid Weight</Text>}


                        </Stack>
                        <SafeAreaView style={{ flexDirection: "row", marginBottom: 3, justifyContent: "center" }}>
                            <View style={{ flex: 1, }} >
                                <Pressable style={styles.save} onPress={() => {
                                    validateParcel().then(() => {
                                        save()
                                    })
                                }}>
                                    <Text style={styles.buttonText}>GetShippingRates</Text>
                                </Pressable>
                            </View>
                            <View style={{ flex: 1, }} >
                                <Pressable style={styles.clear} onPress={clearParcel}>
                                    <Text style={styles.buttonText}>Clear</Text>
                                </Pressable>
                            </View>
                        </SafeAreaView>
                    </SafeAreaView>
                </TouchableWithoutFeedback>

            }

            <SafeAreaView style={{ flexDirection: "row", marginBottom: 3, justifyContent: "center" }}>
                {next != 1 && <View style={{ flex: 1, }} >
                    <Pressable style={styles.prev} onPress={() => {
                        setNext(next - 1)
                        setRatesList([])
                    }}>
                        <Text style={styles.buttonText}>Prev</Text>
                    </Pressable>
                </View>}
            </SafeAreaView>

            {next == 4 && ratesList.length > 0 && <RatesList rates={ratesList} route={route} name={parcel.name + "-" + fromAddress.name + "-" + toAddress.name} isLoading={setIsLoading} />}



        </View>
    )
}

export default ShipmentLabel


const styles = StyleSheet.create({
    drop: {
        borderRadius: 5,
        border: "5px",
        borderTopColor: "red",
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
        width: 150,
        fontSize: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 20,
        elevation: 3,
        backgroundColor: '#1E90FF'
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
    next: {
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
        backgroundColor: '#8B008B'
    },
    prev: {
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
        backgroundColor: '#9370DB'
    },
    getRates: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 8,
        width: 160,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 20,
        elevation: 3,
        backgroundColor: 'green'
    },

    err: {
        color: "red",
        fontSize: 13
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
        flexDirection: "column",
        borderTopWidth: "2px"
    },
    buttonHistoryText: {
        fontSize: 14,
        fontWeight: "bold",
        lineHeight: 21,
        letterSpacing: 0.25,
        color: 'white',
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 2,
        borderRadius: 20,
        borderColor: "black"
    },
});