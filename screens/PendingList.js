import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, StyleSheet, SafeAreaView, Keyboard, FlatList, TouchableWithoutFeedback, View, Pressable, Image, TouchableHighlight } from 'react-native';
import { Button, Input } from "react-native-elements";
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Details from "./Details"

import Constants from "expo-constants";
const { manifest } = Constants;
import axios from "axios";


const ICONS = {
    open: require('../assets/open.jpg'),
    close: require('../assets/close.jpg'),

};


function PendingList(props) {
    const [showMore, setShowMore] = useState(false);
    const [expandMore, setExpandMore] = useState(false);
    const [expandMoreText, setExpandMoreText] = useState("More Details");
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    



    const toggleMore = (val) => {
        console.log("toggleMore")
        setShowMore(!showMore)
    }

    const callShowMoreDetails = (val) => {
        console.log("toggleMore")
        setExpandMore(!expandMore)
        expandMore=="More Details"?setExpandMoreText("Less Details"):setExpandMoreText("More Details");
    }


    return (
        <View key={props.index}>
            <SafeAreaView style={{ marginTop: 5, borderBottomWidth: 1 }} key={props.index}>
                <SafeAreaView style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                    <SafeAreaView style={{ flexDirection: "row", backgroundColor: "#ABD3D5", marginBottom: 2, marginTop: 2 }} >
                        <View style={{ paddingLeft: 10}} >

                            <TouchableWithoutFeedback onPress={() => toggleMore(true)}   >
                                <Image
                                    style={{ paddingLeft: 30,width: 25, height: 25, borderRadius: 50, borderWidth: 0 }}
                                    source={showMore == true ? ICONS["close"] : ICONS["open"]}
                                />
                            </TouchableWithoutFeedback>
                        </View>
                        <View>
                            <Text style={styles.textResult1}>{`Item Name:` + props.item.name}</Text>
                        </View>
                    </SafeAreaView>

                </SafeAreaView>
                {showMore == true && <SafeAreaView style={{ marginTop: 10, borderWidth: 1}} key={props.index}>
                    <SafeAreaView style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                        <Text style={styles.textResult}>{`Shipping Provider: ` + props.item.shipper}</Text>
                    </SafeAreaView>
                    <SafeAreaView style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                        <Text style={styles.textResult}>{`Tracking Numnber: ` + props.item.trackingNum}</Text>
                    </SafeAreaView>
                    <SafeAreaView style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                        <Pressable style={styles.button3} onPress={() => callShowMoreDetails()}>
                            <Text style={styles.buttonText}>Click for More Details</Text>
                        </Pressable>
                    </SafeAreaView>
                    <SafeAreaView style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                        <Text style={{ fontSize: 12 }}>{`Date Added:` + props.item.dateAdded.split("(")[0]}</Text>
                    </SafeAreaView>

                    {expandMore &&  <SafeAreaView style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                        <Details tNum={props.item.trackingNum} token={props.token} shipper={props.item.shipper} id={props.item.id} navigation={props.navigation}/>
                    </SafeAreaView>
                    }
                </SafeAreaView>}
            </SafeAreaView>
        </View>
    )
}

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
    button3: {
        marginTop: 3,
        marginBottom: 1,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: 'orange',
        
    },
    err: {
        color: "red",
        fontSize: 10
    },
    buttonText: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
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
        flex: 1, textAlign: "left", borderWidth: 0,
        borderRadius: 0,
        paddingLeft: 14,
        paddingTop: 5,
        paddingBottom: 5,
        fontWeight: "bold",
        fontSize: 14
    },
    textResult1: {
        flex: 1, textAlign: "left", borderWidth: 0,
        borderRadius: 0,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        fontWeight: "bold",
        fontSize: 14
    },
    container2: {
        flexDirection: "column"
    }
});

export default PendingList