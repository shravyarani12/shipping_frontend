import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Dropdown} from 'react-native-element-dropdown';

const data = [
    { "label": "Fedex", "value": "Fedex" },
    { "label": "UPS", "value": "ups" },
    { "label": "USPS", "value": "usps" },
];

const DropShipper = _props => {
    //const [dropdown, setDropdown] = useState(null);
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
                placeholder={!isFocus ? 'Select Shipper*' : '...'}
                value={_props.value}
                onChange={item => {
                    setIsFocus(false);
                    //setDropdown(item.value);
                    _props.handleDropShipper(item.value,"state");
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

export default DropShipper;

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
        height:50,
        borderRadius:5
      
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