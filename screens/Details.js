import React, { useCallback, useEffect, useState } from 'react'
import { Text, StyleSheet, SafeAreaView, Keyboard, FlatList, TouchableWithoutFeedback, View, Pressable, Image, TouchableHighlight } from 'react-native';
import { Button, Input } from "react-native-elements";
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { HStack, Stack, VStack, TextInput, IconButton, Spacer } from "@react-native-material/core";

import Constants from "expo-constants";
const { manifest } = Constants;
import axios from "axios";



function Details(props) {


  const [state, setState] = useState(null);

  const [error, setError] = useState(null);

  const [isLoading,setIsLoading]=useState(false);

  const callShowMoreDetails = useCallback((tNum) => {

    setIsLoading(true);
    console.log("Start Tracking API calling")
    //const uri=`${process.env.ROUTE}/tracking`
    let uri = `http://localhost:3000/ship/trackingMoreDetails`;
    let reqBody = {
      "trackingNum": props.item.trackingId
    }
    if (props.item.labelUrl.length > 0 && props.item.status != "DELIVERED" && props.item.shippoShipmentId.length > 0) {
      uri = `http://localhost:3000/ship/pendingTrackingMoreDetails`;
    } else {
      reqBody["trackingNum"] = props.tNum
      reqBody["id"] = props.id;
      reqBody["shipper"] = props.shipper;
    }
    axios.post(uri, reqBody, {
      headers: {
        "authorization": "Bearer " + props.token,
        "content-type": "application/json"
      }
    }).then(res => {
      console.log("Tracking API calling")
      if (res.status == 200 && res.data.tracking_number == props.tNum) {
        if (res.data && res.data.tracking_number != null && res.data.tracking_status?.status != null) {
          setState({ ...res.data });
          setIsLoading(false);
        } else {
          setError("true");
          setState(null)
          setIsLoading(false);
        }

      } else {
        console.log("errror")
        setError("true");
        setState(null)
        setIsLoading(false);
      }
    }).catch(err => {
      console.log("API Error")
      console.log(JSON.stringify(err));
      setError("true");
      setState(null)
      setIsLoading(false);
    })
  }, []);


  //login verification
  useEffect(() => {
    callShowMoreDetails()
  }, [callShowMoreDetails])

  return (
    <View>

      {isLoading && <View style={{
        zIndex: 3,
        textAlign: 'center',
        display: "flex",
        justifyContent: "center",
        height: "100%"
      }}>
        <Image
          style={{ alignSelf: "center", width: 50, height: 50, marginBottom: 50 }}
          source={require("../assets/loading_1.gif")}
        />
      </View>}


      {error && <Text style={{ color: "white", backgroundColor: "red" }}>Failed to Get More Details</Text>}

      {state && state.tracking_number != null && state.tracking_status?.status != null &&
        <View>
          <HStack m={4} spacing={2} divider={true}>
            <Text style={{ flex: 0 }}>Status: </Text>
            <Text style={{
              paddingLeft: 10, paddingRight: 10, flex: 0, flexDirection: "row", alignSelf: "auto", backgroundColor: state.tracking_status.status == "DELIVERED" ? "green" : state.status == "TRANSIT" ? "orange" : "lightblue", borderRadius: 20
            }}>{state.tracking_status.status}</Text>
          </HStack>
          <SafeAreaView style={{ marginTop: 3 }}>
            <HStack m={4} spacing={2} divider={true}>
              <View style={{ flex: 1, borderWidth: 2, borderRadius: 10, paddingBottom: 5 }} >
                <Text style={{ paddingLeft: 10, paddingTop: 5, fontWeight: "bold", fontSize: 14 }}>From:</Text>
                {state?.address_from != null && <VStack m={4} spacing={2} divider={true}>
                  <Text style={styles.detailsText} >City:{state.address_from.city}</Text>
                  <Text style={styles.detailsText} >State: {state.address_from.state}</Text>
                  <Text style={styles.detailsText}  >Zip:{state.address_from.zip}</Text>
                  <Text style={styles.detailsText}  >Country:{state.address_from.country}</Text>
                </VStack>}
              </View>
              <View style={{ flex: 1, borderWidth: 2, borderRadius: 10, paddingBottom: 5 }} >
                <Text style={{ paddingLeft: 10, paddingTop: 5, fontWeight: "bold", fontSize: 14 }}>To:</Text>
                {state?.address_to != null && <VStack m={4} spacing={2} divider={true}>
                  <Text style={styles.detailsText} >City:{state.address_to.city}</Text>
                  <Text style={styles.detailsText} >State: {state.address_to.state}</Text>
                  <Text style={styles.detailsText}  >Zip:{state.address_to.zip}</Text>
                  <Text style={styles.detailsText}  >Country:{state.address_to.country}</Text>
                </VStack>}
              </View>
            </HStack>
            <VStack m={4} spacing={2} divider={true} style={{ borderWidth: 2, borderRadius: 10, paddingBottom: 5 }}>
              <Text style={{ paddingLeft: 10, paddingTop: 5, fontWeight: "bold", fontSize: 15 }}>Status:</Text>
              {state.tracking_status.status_date && <Text style={styles.detailsText}>Status_date: {state.tracking_status.status_date}</Text>}
              {state.tracking_status.status_details && <Text style={styles.detailsText}>Status_details: {state.tracking_status.status_details},</Text>}
              {state.tracking_status.substatus && <Text style={styles.detailsText}>Status_message: {state.tracking_status.substatus.text}</Text>}
            </VStack>
            <Spacer />
            <VStack m={4} spacing={2} divider={true} style={{ borderWidth: 2, borderRadius: 10, paddingBottom: 5 }}>
              <Text style={{ paddingLeft: 10, paddingTop: 5, fontWeight: "bold", fontSize: 14 }}>Current Location:</Text>
              <SafeAreaView style={{ dispaly: "flex", flexDirection: "column" }}>
                {state.tracking_status.location && <>  <Text style={styles.detailsText} >City:{state.tracking_status.location.city}</Text>
                  <Text style={styles.detailsText} >State: {state.tracking_status.location.state}</Text>
                  <Text style={styles.detailsText}  >Zip:{state.tracking_status.location.zip}</Text>
                  <Text style={styles.detailsText}  >Country:{state.tracking_status.location.country}</Text>
                </>}
                {!state.tracking_status.location && <Text style={styles.detailsText}  >Unknown</Text>}
              </SafeAreaView>
            </VStack>
          </SafeAreaView>
        </View>
      }
    </View>
  )
}



export default Details

const styles = StyleSheet.create({
  flexContainer: {

    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    alignContent: "stretch",
    alignItems: "flex-start",
    marginBottom: 2
  },

  flexChild1: {

    order: 0,
    flex: 0,
    alignSelf: "stretch",
    backgroundColor: "lightblue",
    marginBottom: 2
  },
  flexChild2: {
    order: 0,
    marginTop: 5,
    flex: 0,
    alignSelf: "stretch",
    backgroundColor: "lightblue"
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
  },
  detailsText: {
    paddingLeft: 5, flex: 0, textAlign: "left", fontSize: 12
  }
});