import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, StyleSheet, SafeAreaView, Keyboard, FlatList, TouchableWithoutFeedback, View, Pressable, Image, TouchableHighlight, ScrollView } from 'react-native';
import { Button, Input } from "react-native-elements";
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { setupDataListener } from "../helpers/fb-history";
import NewTracking from "./NewTracking";
import PendingList from "./PendingList";

import Constants from "expo-constants";
const { manifest } = Constants;
import axios from "axios";
import { child } from 'firebase/database';
import { getIndieNotificationInbox } from 'native-notify';

import { useIsFocused  } from "@react-navigation/native"
const ICONS = {
    open: require('../assets/open.jpg'),
    close: require('../assets/close.jpg'),

};
function Home({ route, navigation }) {
    console.log("Home")
    //console.log(route)
    const [pendingItemsList, setPendingItemsList] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [deliveredItemsList, setDeliveredItemsList] = useState([]);
    const [viewForm, setViewForm] = useState(false);
    const [viewForm1, setViewForm1] = useState(false);
    const [btnTxt, setBtnTxt] = useState("Add Tracking");
    const [btnTxt1, setBtnTxt1] = useState("Create Shipment Label");
    const [showPendingMore, setShowPendingMore] = useState([]);
    const [deleteMessage, setDeleteMessage] = useState(null)

    const [isLogin, setIsLogin] = useState(null);
    const isMounted = useRef(false);

    const [refreshInterval, setRefreshInterval] = useState(0);

    const isFocused = useIsFocused();


    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ paddingRight: 10 }}
                    onPress={() => {
                        //console.log(route)
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
                        toggleRefresh()
                    }}
                >
                    <View style={{ backgroundColor: "black", borderRadius: 20, }}>
                        <Text style={styles.buttonHistoryText}>Refresh</Text>
                    </View>
                </TouchableOpacity>
            )
        })
    });


    const execute = () => {
        // console.log(route.params)
        if (route.params?.token != null) {
            setIsLogin(true)
            console.log("Home API Callback")
            console.log("calling getshipments")
            const uri = `https://www.shravyarani.com/ship/getTracking`
            console.log({
                "authorization": "Bearer " + route.params?.token,
                "content-type": "application/json"
            })
            axios.get(uri, {
                headers: {
                    "authorization": "Bearer " + route.params?.token,
                    "content-type": "application/json"
                }
            }).then(res => {
                console.log("API calling")
                //console.log(res.data)
                if (res.status == 200) {
                    setDeleteMessage(null);
                    setPendingItemsList(res.data.pendingShipments)
                    setDeliveredItemsList(res.data.deliveredShipments)
                } else {
                    navigation.navigate('Register', {
                        isLogin: null
                    })
                }
                return "done";
            }).catch(err => {
                console.log("API Error")
                console.log(err.response.data);
                navigation.navigate('Login', {
                    isLogin: null
                })
            })
        } else {
            navigation.navigate('Login', {
            })
            return "done";
        }
    };



    useEffect(() => {
        // //Brute Login 
        route.params={}
        route.params.token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6MTQsIm5hbWUiOiJzaHJhdnlhIGRhbWFyYXBlbGxpIn0sImlhdCI6MTY3OTQxNDkwMiwiZXhwIjoxNjc5NDQwMTAyfQ.2ILcwiau2N1bVvkn6gBO_p-MIhlvnRo8_z6M8PLzQ2c';
        // //Brute Login 
        
        if (route.params?.token == null) {
            navigation.navigate('Login', {
            })
        }
        return(()=>{
            setRefresh(!refresh);
        })
    }, [])

    // Do something else with the data
    useEffect(() => {
        if (isMounted.current) {
            execute()
        } else {
            isMounted.current = true;
        }
    }, [route.params?.isLogin, route.params?.added, refresh]);

    useEffect(() => {
        isFocused && execute()
      },[isFocused]);


    const toggleRefresh = (val) => {
        setDeleteMessage(null);
        setRefresh(!refresh);
    }

    const toggleForm = (val) => {
        navigation.navigate('AddTracking', {
            isLogin: "True",
            token: route.params.token,
            userId: route.params?.userId,
        })
    }

    const toggleShipmentLabelForm = (val) => {
        navigation.navigate('ShipmentLabel', {
            isLogin: "True",
            token: route.params.token,
            userId: route.params?.userId,
        })
    }


    const toggleMore = (val) => {
        console.log("toggleMore")
        setShowMore(!showMore);
        setDeleteMessage(null);
    }

    const btnsetDeleteMessage = (val) => {
        setDeleteMessage(val)
    }


    return (
        <ScrollView>
            <View style={{ marginBottom: 50 }}>

                <View style={{ marginLeft: "0%" }}>
                    <Pressable style={styles.button2} onPress={() => toggleForm(true)}>
                        <Text style={styles.buttonText}>{btnTxt}</Text>
                    </Pressable>
                </View>

                <View style={{ marginLeft: "0%" }}>
                    <Pressable style={styles.button2} onPress={() => toggleShipmentLabelForm(true)}>
                        <Text style={styles.buttonText}>{btnTxt1}</Text>
                    </Pressable>
                </View>


                {deleteMessage && <Text>Deleted Succesfully</Text>}
                {/* <Pressable style={styles.button2} onPress={()=>toggleRefresh()}>
                                <Text style={styles.buttonText}>Refresh</Text>
                            </Pressable> */}
                {/* {viewForm && <NewTracking userId={route.params?.userId} token={route.params?.token} showForm={toggleForm} navigation={navigation} />} */}
                <Text style={{ fontSize: 16, paddingLeft: 20, paddingTop: 10, paddingBottom: 10, marginTop: 20, backgroundColor: "lightgreen" }}>Pending shipments</Text>
                {/*  <FlatList nestedScrollEnabled
                    keyExtractor={(item) => item.id}
                    data={pendingItemsList}
                    renderItem={({ index, item }) => {
                        console.log(item)
                        return <PendingList index={index} item={item} token={route.params?.token} navigation={navigation} />
                    }}
                >
                </FlatList> */}
                <ScrollView>
                    {pendingItemsList.map((item, index) => (
                        <PendingList key={index} index={index} item={item} token={route.params?.token} navigation={navigation} deleteMessage={btnsetDeleteMessage} refresh={toggleRefresh} />
                    ))}
                </ScrollView>
                <Text style={{ fontSize: 16, paddingLeft: 20, paddingTop: 10, paddingBottom: 10, marginTop: 20, backgroundColor: "lightgreen" }}>Delivered shipments</Text>

                <ScrollView>
                    {deliveredItemsList.map((item, index) => (
                        <PendingList key={index} index={index} item={item} token={route.params?.token} navigation={navigation} deleteMessage={btnsetDeleteMessage} refresh={toggleRefresh} />
                    ))}
                </ScrollView>



                {/* <FlatList nestedScrollEnabled
                    keyExtractor={(item) => item.id}
                    data={deliveredItemsList}
                    renderItem={({ index, item }) => {
                        console.log(item)
                        return <PendingList index={index} item={item} token={route.params?.token} navigation={navigation} />
                    }}
                >
                </FlatList> */}

            </View>
        </ScrollView>
    )
}

export default Home
const styles = StyleSheet.create({
    input: {
        height: 5,
        margin: 0,
        borderBottomWidth: 0,
        padding: 0,
        fontSize: 15,
        flex: 1
    },
    scrollView: {
        backgroundColor: 'white',
        marginHorizontal: 20,
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
        margin: 5,
        marginBottom: 5,
        align: "center",
        fontSize: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'green'
    },
    button3: {
        marginTop: 3,
        marginBottom: 1,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: 'orange'
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
        borderWidth: 2,
        borderRadius: 20,
        borderColor: "black"
    },

    textResult: {
        flex: 1, textAlign: "left", borderWidth: 0,
        borderRadius: 0,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        fontWeight: "bold",
        fontSize: 12
    },
    container2: {
        flexDirection: "column"
    }
});
