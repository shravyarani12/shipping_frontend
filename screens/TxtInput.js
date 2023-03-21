import React, {useEffect} from 'react'
import { Text, StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback, View, Pressable, Image } from 'react-native';
import { Stack, TextInput, IconButton } from "@react-native-material/core";
import { LogBox  } from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
export default function TxtInput(props) {

    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
      }, [])

    return (
        <View style={styles.inputContainer}>
            <TextInput
                variant='outlined'
                value={props.state[props.stateKey]}
                onChangeText={newText => props.handleChange(newText, props.stateKey)}
                label={props.label}

            />
            {props.state[props.stateKey].length > 0 &&
                <FontAwesome5 style={styles.icon} name={"delete"} size={20} onPress={() =>
                    props.handleChange("", props.stateKey)} />
            }
        </View>

    )
}


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
    }
});