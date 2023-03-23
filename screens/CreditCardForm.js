import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { LogBox } from 'react-native';


const CreditCardForm = (props) => {
    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    }, [])

    const [cardNumber, setCardNumber] = useState('');
    const [expirationMM, setExpirationM] = useState('');
    const [expirationYY, setExpirationY] = useState('');
    const [cvc, setCvc] = useState('');
    const [name, setName] = useState('');
    const [valid, setValid] = useState(null);

    
    // validation function goes here

    const validate = () => {
        const validCardNumber = /^([0-9]{4}[- ]){3}[0-9]{4}|[0-9]{16}$/i.test(cardNumber);
        const validCvc = /^[0-9]{3,4}$/i.test(cvc);
        const validExpiration = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{4})$/.test(expirationMM);
        const expirationParts = expirationMM.split('/');
        const month = parseInt(expirationParts[0]);
        const year = parseInt(expirationParts[1]);
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            setValid("false");
            return false;
        }

        if (validCardNumber && validCvc && validExpiration) {
            setValid("true");
            return true
        } else {
            setValid("false");
            return false;
        }

    };

    const handleCardNumberChange = (value) => {
        setValid(null)
        setCardNumber(value);
    };

    const handleExpirationChangeM = (value) => {
        setValid(null)
        setExpirationM(value);
    };

    const handleCvcChange = (value) => {
        setValid(null)
        setCvc(value);
    };

    const handleNameChange = (value) => {
        setValid(null)
        setName(value);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Card Number"
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                keyboardType="number-pad"
                maxLength={19}
            />
            <TextInput
                style={styles.input}
                placeholder="Expiration (MM/YYYY)"
                value={expirationMM}
                onChangeText={handleExpirationChangeM}
                keyboardType="number-pad"
                maxLength={7}
            />

            <TextInput
                style={styles.input}
                placeholder="CVC"
                value={cvc}
                onChangeText={handleCvcChange}
                keyboardType="number-pad"
                maxLength={4}
            />
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={handleNameChange}
            />
            {valid != null &&
                <Text style={styles.validationText}>
                    {valid == "true" ? 'Valid Card Details ' : 'Invalid Card Details'}
                </Text>
            }

            <Text title="Pay" style={{ color: "white", backgroundColor: "purple", borderRadius: 20, textAlign: "center",  marginTop:15,npaddingTop: 10, paddingBottom: 10, fontSize: 18 }}
                onPress={() => {
                    if (validate()) {
                        const expirationParts = expirationMM.split('/');
                        const month = parseInt(expirationParts[0]);
                        const year = parseInt(expirationParts[1]);
                        console.log(year)
                        props.setCardData({ cardNumber, month, year, cvc }, true);
                    }
                }} >Pay</Text>

            <Text title="Clear" style={{ color: "white", backgroundColor: "red", borderRadius: 20, textAlign: "center",  marginTop:15,paddingTop: 10, paddingBottom: 10, fontSize: 18 }}
                onPress={() => {
                    handleCardNumberChange("");
                    handleCvcChange("")
                    handleExpirationChangeM("")
                    handleNameChange("")
                }} >Clear</Text>

            <Text title="Cancel" style={{ color: "white", backgroundColor: "orange", borderRadius: 20, textAlign: "center", marginTop:15,paddingTop: 10, paddingBottom: 10, fontSize: 18 }}
                onPress={() => {
                    handleCardNumberChange("");
                    handleCvcChange("")
                    handleExpirationChangeM("")
                    handleNameChange("")
                    props.setPaymentFormVisible(false);
                }} >Cancel</Text>
        </View>
    );
};
export default CreditCardForm;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        marginBottom: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        fontSize: 16,
    },
    validationText: {
        alignSelf: 'flex-end',
        marginTop: 8,
        fontWeight: 'bold',
        color: '#2ecc71',
    },
});