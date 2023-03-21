import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';

const data = [
    { "label": "Alabama", "value": "AL" },
    { "label": "Alaska", "value": "AK" },
    { "label": "Arizona", "value": "AZ" },
    { "label": "Arkansas", "value": "AR" },
    { "label": "California", "value": "CA" },
    { "label": "Colorado", "value": "CO" },
    { "label": "Connecticut", "value": "CT" },
    { "label": "Delaware", "value": "DE" },
    { "label": "Florida", "value": "FL" },
    { "label": "Georgia", "value": "GA" },
    { "label": "Hawaii", "value": "HI" },
    { "label": "Idaho", "value": "ID" },
    { "label": "Illinois", "value": "IL" },
    { "label": "Indiana", "value": "IN" },
    { "label": "Iowa", "value": "IA" },
    { "label": "Kansas", "value": "KS" },
    { "label": "Kentucky", "value": "KY" },
    { "label": "Louisiana", "value": "LA" },
    { "label": "Maine", "value": "ME" },
    { "label": "Maryland", "value": "MD" },
    { "label": "Massachusetts", "value": "MA" },
    { "label": "Michigan", "value": "MI" },
    { "label": "Minnesota", "value": "MN" },
    { "label": "Mississippi", "value": "MS" },
    { "label": "Missouri", "value": "MO" },
    { "label": "Montana", "value": "MT" },
    { "label": "Nebraska", "value": "NE" },
    { "label": "Nevada", "value": "NV" },
    { "label": "New Hampshire", "value": "NH" },
    { "label": "New Jersey", "value": "NJ" },
    { "label": "New Mexico", "value": "NM" },
    { "label": "New York", "value": "NY" },
    { "label": "North Carolina", "value": "NC" },
    { "label": "North Dakota", "value": "ND" },
    { "label": "Ohio", "value": "OH" },
    { "label": "Oklahoma", "value": "OK" },
    { "label": "Oregon", "value": "OR" },
    { "label": "Pennsylvania", "value": "PA" },
    { "label": "Rhode Island", "value": "RI" },
    { "label": "South Carolina", "value": "SC" },
    { "label": "South Dakota", "value": "SD" },
    { "label": "Tennessee", "value": "TN" },
    { "label": "Texas", "value": "TX" },
    { "label": "Utah", "value": "UT" },
    { "label": "Vermont", "value": "VT" },
    { "label": "Virginia", "value": "VA" },
    { "label": "Washington", "value": "WA" },
    { "label": "West Virginia", "value": "WV" },
    { "label": "Wisconsin", "value": "WI" },
    { "label": "Wyoming", "value": "WY" },
];

const DropD = _props => {
   // const [dropdown, setDropdown] = useState(null);
    const [selected, setSelected] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const _renderItem = item => {
        return (
            <View style={styles.item}>
                <Text style={[styles.textItem,_props.value==item.value && { backgroundColor: 'grey' }]}>{item.label}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Dropdown
                style={styles.dropdown}
                containerStyle={styles.shadow}
                data={data}
                searchPlaceholder="Search"
                labelField="label"
                valueField="value"
                label="Dropdown"
                placeholder={!isFocus ? 'Select State*' : '...'}
                value={_props.value}
                onChange={item => {
                    setIsFocus(false);
                    //setDropdown(item.value);
                    _props.handleToAddressChange(item.value,"state",_props.add=="to"?"to":"from");
                }}
                renderLeftIcon={() => (
                    <Image style={styles.icon} source={require('../assets/open.jpg')} />
                )}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                activeColor="red"
                renderItem={item => _renderItem(item)}
                textError="Error"
            />
        </View>
    );
};

export default DropD;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        border:"2px",
        
    },
    dropdown: {
        borderBottomColor: 'black',
        borderWidth: 1,
        borderColor:"grey",
        height:45
      
    },
    icon: {
        marginRight: 15,
        width: 30,
        height: 30,
        borderRadius:10
    },
    item: {
        paddingVertical: 3,
        paddingHorizontal: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:"#fff"
    },
    textItem: {
        flex: 1,
        paddingLeft:10,
        fontSize: 16,
        backgroundColor:"#fff"
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        backgroundColor:"#fff"
    },
});