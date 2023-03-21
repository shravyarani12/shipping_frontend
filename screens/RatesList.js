import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Text, StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback, View, Pressable, Image, } from 'react-native';
import { VStack, Box, Divider, Stack, HStack, ListItem, Avatar, Flex, Spacer, TextInput, IconButton, Button, FAB } from "@react-native-material/core";
import Icon from "@expo/vector-icons/";
import MIcon from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Modal from "react-native-modal";
const item = {
    provider: "",
    providerImage: "",
    amount: "",
    estimatedDays: "",
    arrivesBy: "",
    durationTerms: "",
    rateId: ""
}
export default function RatesList(props) {

    const [apiErr, setApiErr] = useState("false")
    const [apiLabelErr, setApiLabelErr] = useState("false")
    const [isModalVisible, setModalVisible] = useState(false);
    const [labelDetails, setLabelDetails] = useState({});
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(null);
    const [emailErr, setEmailErr] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    useEffect(() => {
        props.isLoading(false);
    }, [])


    function getLabel(item) {


        //SaveDb
        setIsLoading(true);
        setApiErr("true");
        return new Promise((resolve, reject) => {
            const uri = `https://cis693-backend.vercel.app/ship/createShipmentLabel`;
            console.log(item)
            axios.post(uri, { rateId: item.object_id }, {
                headers: {
                    "authorization": "Bearer " + props.route.params.token,
                    "content-type": "application/json"
                }
            }).then(res => {
                console.log("Rates Object")
                if (res.status == 200) {
                    console.log(res.data)
                    setLabelDetails({ ...res.data.transaction })
                    if (res.data.transaction.object_state != "INVALID") {
                        const uri = `https://cis693-backend.vercel.app/ship/addTracking`;
                        console.log({ name: props.name, trackingNum: res.data.transaction.tracking_number, shippingProvider: item.provider })
                        axios.post(uri, { name: props.name.split("-")[0], trackingNum: res.data.transaction.tracking_number, shippingProvider: item.provider }, {
                            headers: {
                                "authorization": "Bearer " + props.route.params.token,
                                "content-type": "application/json"
                            }
                        }).then(res => {
                            setIsLoading(false);
                            setApiErr("false")
                            setApiLabelErr("false")
                            setModalVisible(true)


                        }).catch(err => {
                            setIsLoading(false);
                            setApiErr("false")
                            setApiLabelErr("true")
                            setModalVisible(true)
                        })
                    } else {
                        setIsLoading(false);
                        setApiErr("false")
                        setApiLabelErr("true")
                        setModalVisible(true)
                        setLabelDetails({ ...res.data.transaction })
                    }

                    return resolve(res.data)
                } else {
                    console.log(res)
                    setIsLoading(false);
                    setApiErr("true")
                    setModalVisible(true)
                    return reject("")
                }
            }).catch(err => {
                console.log("InValid Parcel Resp")
                console.log(JSON.stringify(err));
                if (err.response.status != 400) {
                    props.navigation.navigate('Login', {
                        isLogin: null
                    })
                } else {
                    setApiErr("true")
                    setModalVisible(true)
                }
                setIsLoading(false);
                return reject("")
            })
        })
    }


    function sendEmail(labelDetails) {
        console.log("email : "+email)
        let emailRegex = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;
        console.log(emailRegex.test(email))
        if (!emailRegex.test(email)) {
            setEmailErr("true");
        } else {
            setIsLoading(true);
            setApiErr("true");
            return new Promise((resolve, reject) => {
                const uri = `https://cis693-backend.vercel.app/ship/sendEmail`;
                console.log(item)
                axios.post(uri, { ...labelDetails, email: email, name: props.name }, {
                    headers: {
                        "authorization": "Bearer " + props.route.params.token,
                        "content-type": "application/json"
                    }
                }).then(res => {
                    console.log("Rates Object")
                    if (res.status == 200) {
                        console.log(res.data)
                        if (res.status = 200) {
                            setIsLoading(false);
                            setEmailSent("true")

                        } else {
                            setIsLoading(false);
                            setEmailSent("false")
                        }
                        setTimeout(() => {
                            setEmailSent(null);
                            setEmail("")
                            setEmailErr("false");
                            toggleModal();

                        }, 3000)

                        return resolve(res.data)
                    } else {
                        console.log(res)
                        setApiErr("true")
                        setIsLoading(false);
                        setModalVisible(true)
                        return reject("")
                    }
                }).catch(err => {
                    console.log("InValid Parcel Resp")
                    console.log(JSON.stringify(err));
                    // if (err.response.status != 400) {
                    //     props.navigation.navigate('Login', {
                    //         isLogin: null
                    //     })
                    // } else {
                    //     setApiErr("true")
                    //     setModalVisible(true)
                    // }
                    setIsLoading(false);
                    return reject("")
                })
            })

        }

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
                        icon={props => <MIcon name="plus" {...props} />}
                        color="primary"
                        loading
                    />
                </Stack>
            </Modal>}


            <VStack m={2} spacing={1}>

                <Stack spacing={2} style={{ marginBottom: 5, borderRadius: 5 }}>
                    <Text style={{ fontSize: 24, textAlign: "center", textDecoration: "underline", fontFamily: "ui-sans-serif", paddingBottom: 15, marginTop: 20, borderRadius: 5, border: 20, borderColor: "black" }}>Rates List</Text>
                </Stack>
                <Flex direction={"row"} style={{ backgroundColor: "orange" }}>
                    <Text style={{ textDecoration: "underline", fontSize: 18, textAlign: "center", fontFamily: "ui-sans-serif", paddingLeft: 15, paddingBottom: 15, marginTop: 5, borderRadius: 5, border: 20, borderColor: "black", paddingTop: 10, paddingRight: 10 }}>Provider</Text>
                    <Text style={{ textDecoration: "underline", fontSize: 18, fontFamily: "ui-sans-serif", paddingLeft: 20, paddingBottom: 15, marginTop: 5, borderRadius: 5, border: 20, borderColor: "black", paddingTop: 10, paddingRight: 10, marginLeft: 20 }}>Details</Text>
                    <Spacer />
                    <Text style={{ textDecoration: "underline", fontSize: 18, textAlign: "center", fontFamily: "ui-sans-serif", paddingBottom: 15, marginTop: 5, borderRadius: 5, border: 20, borderColor: "black", paddingTop: 10, paddingRight: 10, paddingLeft: 10 }}>Generate Label</Text>
                </Flex>
                {props.rates.map((item, index) => {
                    return (<ListItem
                        leadingMode="avatar"
                        key={index}
                        title={
                            <VStack spacing={1}>
                                {item.servicelevel.name && <Text style={{ fontSize: 14 }}>Name : {item.servicelevel.name}</Text>}
                                <Text style={{ fontSize: 14 }}>Amount : $ {item.amount}</Text>
                                {item.estimated_days && <Text style={{ fontSize: 14 }}>Estimated Days : {item.estimated_days}</Text>}
                                {item.arrives_by && <Text style={{ fontSize: 14 }}>Arrives By: {item.arrives_by} (HH:MM:SS)</Text>}
                                {item.attributes.length > 0 && <Text style={{ fontSize: 14, color: "green", fontWeight: "bold" }}>{item.attributes[0].toUpperCase()}</Text>}
                            </VStack>
                        }
                        leading={<VStack m={2} spacing={1} style={{ paddingTop: 10 }}>
                            <Avatar image={{ uri: item.provider_image_200 }} size={40} />
                            <Text style={{ fontSize: 16, textAlign: "center", fontFamily: "ui-sans-serif", paddingBottom: 15, marginTop: 5, paddingRight: 10 }}>{item.provider}</Text>
                        </VStack>}
                        trailing={props =>
                            <View style={{ right: 30 }}>
                                <FontAwesome5.Button name="local-post-office" backgroundColor="green" onPress={() => { getLabel(item) }}>
                                    <Text style={{ fontFamily: 'Arial', fontSize: 12, color: "white" }} onPress={() => { getLabel(item) }}>
                                        Get Label
                                    </Text>
                                </FontAwesome5.Button>
                            </View>
                            //  <FontAwesome5 style={styles.icon} name={"local-post-office"} size={30} color={"green"} onPress={() => { getLabel(item.object_id) }} />
                        }
                    />)
                })}
            </VStack>
            <Modal isVisible={isModalVisible} style={{ maxHeight: 300, borderRadius: 20 }}>
                <View style={{ flex: 1, backgroundColor: "white", paddingTop: 50, paddingRight: 15, paddingLeft: 15, height: 50, border: 15, borderRadius: 15 }}>
                    {apiLabelErr == "false" &&
                        <VStack spacing={1}>
                            <Text style={{ fontSize: 18, paddingBottom: 20 }}>Enter Email Id to which details should be sent to</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    variant='outlined'
                                    value={email}
                                    onChangeText={e => {
                                        setEmail(e)
                                        setEmailErr("false");
                                    }}
                                    label={"Enter Email Id"}
                                />
                                {email.length > 0 &&
                                    <FontAwesome5 style={styles.icon} name={"email"} size={20} onPress={() => {
                                        sendEmail(labelDetails)
                                    }} />
                                }
                            </View>

                            {emailSent == "true" && <Text style={{ textAlign: "center", fontSize: 14, color: "green", fontStyle: "italic", paddingBottom: 10, paddingTop: 10 }}>Label was sent to email Succesfully</Text>}

                            {emailSent == "false" && <Text style={{ textAlign: "center", fontSize: 14, color: "red", fontStyle: "italic", paddingBottom: 10, paddingTop: 10 }}>Failed to Send Email, Try Again!!</Text>}

                            {emailErr=="true" &&
                                <VStack spacing={1}>
                                    <Text style={{ textAlign: "center", fontSize: 14, color: "red", fontStyle: "italic", }}>Enter Valid Email</Text>
                                </VStack>
                            }
                            <View style={[{ paddingLeft: "35%", borderRadius: 20 }]}>
                                <Text title="CLOSE" style={{ color: "white", backgroundColor: "purple", borderRadius: 20, textAlign: "center", paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20, fontSize: "18", width: "fit-content" }}
                                    onPress={() => {
                                        toggleModal();
                                        setEmail("");
                                        setEmailErr("false");
                                        setEmailSent(null)

                                    }} >CLOSE</Text>
                            </View>
                        </VStack>

                    }

                    {apiLabelErr == "true" &&
                        <VStack spacing={1}>
                            <Text style={{ textAlign: "center", fontSize: 16, color: "red", fontStyle: "italic", }}>Unable to Generate the Label</Text>
                            <Text style={{ textAlign: "center", fontSize: 13, color: "red", fontStyle: "italic", }}>Reason: {(labelDetails.messages && labelDetails.messages.length > 0 && labelDetails.messages[0].text) ? labelDetails.messages[0].text : "UNKNOWN"}</Text>
                        </VStack>
                    }

                </View>
            </Modal>
        </View>
    )
}



const styles = StyleSheet.create({
    inputContainer: {
        justifyContent: 'center',
        paddingBottom: 20
    },
    input: {
        height: 50,
    },
    icon: {
        position: 'absolute',
        right: 10,
    }
});