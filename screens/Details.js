import React, { useCallback, useEffect, useState } from 'react'
import { Text, StyleSheet, SafeAreaView, Keyboard, FlatList, TouchableWithoutFeedback, View, Pressable, Image, TouchableHighlight } from 'react-native';
import { Button, Input } from "react-native-elements";
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';


import Constants from "expo-constants";
const { manifest } = Constants;
import axios from "axios";



function Details(props) {

 
  const [state, setState] = useState(null);

  const [error, setError] = useState(null)
  const callShowMoreDetails = useCallback((tNum) => {
    console.log("Start Tracking API calling")
    //const uri=`${process.env.ROUTE}/tracking`
    const uri=`https://cis693-backend.vercel.app/ship/trackingMoreDetails`;
    console.log({
      "id":props.id,
      "shipper": props.shipper,
      "trackingNum": props.tNum
    })
    axios.post(uri, {
      "id":props.id,
      "shipper": props.shipper,
      "trackingNum": props.tNum
    }, {
      headers: {
        "authorization": "Bearer "+props.token,
        "content-type": "application/json"
      }
    }).then(res => {
      console.log("Tracking API calling")
      //console.log(res.data)
      //console.log(res.data.tracking_number==props.tNum)
      if (res.status == 200 && res.data.tracking_number==props.tNum) {
        if(res.data && res.data.tracking_number!=null && res.data.tracking_status?.status!=null){
          setState({...res.data});
        }else{
          setError("true");
          setState(null)
        }
        
      } else {
        console.log("errror")
        setError("true");
        setState(null)
      }
    }).catch(err => {
      console.log("API Error")
      console.log(JSON.stringify(err));
      setError("true");
      setState(null)
    })
  }, []);


  //login verification
  useEffect(() => {
    callShowMoreDetails()
  }, [callShowMoreDetails])

  console.log(state)
  return (
    <View>
   {error && <Text style={{color:"white",backgroundColor:"red"}}>Failed to Get More Details</Text>} 
    {state && state.tracking_number!=null && state.tracking_status?.status!=null &&
    <View>
      <SafeAreaView style={{ flexDirection: "row" }}>
        <Text style={{ flex: 0 }}>Status: </Text>
        <Text style={{
          paddingLeft: 10, paddingRight: 10, flex: 0, flexDirection: "row", alignSelf: "auto", backgroundColor: state.tracking_status.status == "DELIVERED" ? "green" : state.status == "TRANSIT" ? "orange" : "lightblue", borderRadius: 20
        }}>{state.tracking_status.status}</Text>
      </SafeAreaView>
      <SafeAreaView style={{ marginTop: 3 }}>
        <SafeAreaView style={{ flexDirection: "row", marginBottom: 3 }}>
          <View style={{ flex: 1, borderWidth: 2, borderRadius: 10 }} >
            <Text style={{ fontWeight: "bold", fontSize: 13 }}>From:</Text>
           { state?.address_from!=null && <SafeAreaView style={{ dispaly: "flex", flexDirection: "column" }}>
              <Text style={{ paddingLeft: 5, flex: 0, textAlign: "left" }} >City:{state.address_from.city}</Text>
              <Text style={{ paddingLeft: 5, flex: 0, textAlign: "left" }} >State: {state.address_from.state}</Text>
              <Text style={{ paddingLeft: 5, flex: 0, textAlign: "left" }}  >Zip:{state.address_from.zip}</Text>
              <Text style={{ paddingLeft: 5, flex: 0, textAlign: "left" }}  >Country:{state.address_from.country}</Text>
            </SafeAreaView> }
          </View>
          <View style={{ flex: 1, borderWidth: 2, borderRadius: 10 }} >
            <Text style={{ fontWeight: "bold", fontSize: 13 }}>To:</Text>
            { state?.address_to!=null &&   <SafeAreaView style={{ dispaly: "flex", flexDirection: "column" }}>
              <Text style={{ paddingLeft: 5, flex: 0, textAlign: "left" }} >City:{state.address_to.city}</Text>
              <Text style={{ paddingLeft: 5, flex: 0, textAlign: "left" }} >State: {state.address_to.state}</Text>
              <Text style={{ paddingLeft: 5, flex: 0, textAlign: "left" }}  >Zip:{state.address_to.zip}</Text>
              <Text style={{ paddingLeft: 5, flex: 0, textAlign: "left" }}  >Country:{state.address_to.country}</Text>
            </SafeAreaView>}
          </View>
        </SafeAreaView>
        <View style={styles.flexContainer} >
          <View style={styles.flexChild1} >
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>Status:</Text>
            <Text style={{ paddingLeft: 5, flex: 0, textAlign: "left" }}>Status_date: {state.tracking_status.status_date}</Text>
            <Text style={{ paddingLeft: 5, flex: 0, textAlign: "left" }}>Status_details: {state.tracking_status.status_details},</Text>
            <Text style={{ paddingLeft: 5, flex: 0, textAlign: "left" }}>Status_message: {state.tracking_status.substatus.text}</Text>
          </View>
          
        </View>
        <View style={styles.flexContainer} >
        <View style={styles.flexChild1} >
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>Current Location:</Text>
            <SafeAreaView style={{ dispaly: "flex", flexDirection: "column" }}>
              <Text style={{ paddingLeft: 5, flex: 0, textAlign: "left" }} >City:{state.tracking_status.location.city}</Text>
              <Text style={{ paddingLeft: 5, flex: 0, textAlign: "left" }} >State: {state.tracking_status.location.state}</Text>
              <Text style={{ paddingLeft: 5, flex: 0, textAlign: "left" }}  >Zip:{state.tracking_status.location.zip}</Text>
              <Text style={{ paddingLeft: 5, flex: 0, textAlign: "left" }}  >Country:{state.tracking_status.location.country}</Text>
            </SafeAreaView>
          </View>
          </View>
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
    borderWidth: 2,
    marginBottom:2,
    borderRadius:5
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