import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';


//import Stripe from 'react-native-stripe-api';
//import Stripe from 'react-native-stripe-payments';
import axios from "axios";
import querystring from "querystring";
import { LogBox } from 'react-native';

import CreditCardForm from './CreditCardForm';


export default function PaymentForm(props) {

    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    }, [])

    const [cardDetails, setCardDetails] = useState({});
    const [cardNumber, setCardNumber] = useState('');
    const [expMonth, setExpMonth] = useState('');
    const [expYear, setExpYear] = useState('');
    const [cvc, setCvc] = useState('');


    const [loading, setLoading] = useState(false);

    const handleCardDetailsChange = (cardDetails) => {
        setCardDetails(cardDetails);
    };

    const reset=()=>{
        setCardDetails("")
        setCardNumber("")
        setExpMonth("")
        setExpYear("")
        setCvc("");
    }

    const handlePayPress = async (cardNumber,expMonth,expYear,cvc) => {
        setLoading(true);
        try {
            const stripe = axios.create({
                baseURL: 'https://api.stripe.com/v1',
                headers: {
                    Authorization: `Bearer sk_test_51Mo6dSDHNZpdr5ANYPxT3wPRZUELkOeLyoFPtYwxqEHGciIYYqf8wDjPqLCOjKBhuPjs5Kt57tZI7U0e8HDnhuBJ00IJEBUgOv`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const createToken = async (card) => {
                const params = new URLSearchParams();
                params.append('card[number]', card.number);
                params.append('card[exp_month]', card.exp_month);
                params.append('card[exp_year]', card.exp_year);
                params.append('card[cvc]', card.cvc);
                const response = await stripe.post('/tokens', params.toString());
                console.log(response);
                return response.data.id;
            };
            createToken({
                number: cardNumber,
                exp_month: parseInt(expMonth),
                exp_year: parseInt(expYear),
                cvc: cvc
            }).then(async (tokenId) => {
                console.log(`Token ID: ${tokenId}`);

                try{

                    const stripe = axios.create({
                        baseURL: 'https://api.stripe.com',
                        headers: {
                          Authorization: `Bearer sk_test_51Mo6dSDHNZpdr5ANYPxT3wPRZUELkOeLyoFPtYwxqEHGciIYYqf8wDjPqLCOjKBhuPjs5Kt57tZI7U0e8HDnhuBJ00IJEBUgOv`,
                          'Content-Type': 'application/x-www-form-urlencoded'
                        }
                      });

                      let amount=props.labelDetails.price.split(".")
                      let penny=amount[1].split('')
                      
                      amount=amount[0]+(penny.lenght>0&&penny[0])+(penny.length>1&& penny[1])
                      amount =parseFloat(amount)*100
                      const currency = 'usd';
                      const payment_method  = `${tokenId}`; // Replace with the actual token ID
                      const card={
                        number: cardNumber,
                        exp_month: parseInt(expMonth),
                        exp_year: parseInt(expYear),
                        cvc: cvc
                    }
                      const chargeData = {
                        amount,
                        currency,
                        source: tokenId,
                        description: 'Charge for test@example.com'
                      };
                      
                      const data = querystring.stringify(chargeData);
                      const charge = await stripe.post('/v1/charges', data);

                      reset();
                      


                      try{
                        let createLabel=await props.afterPayment(props.item);
                      props.setModalVisible(true);
                      props.setPaymentFailed(false);
                      }catch(err){
                        console.log("Create Error");
                        console.error(error);
                        props.setPaymentFailed(false);
                        props.setModalVisible(true);

                      }

                      
                      


                }catch(error){
                    console.log("Create Error");
                        console.error(error);
                    props.setPaymentFormVisible(true)
                    props.setPaymentFailed(true)
                    props.setModalVisible(true);

                }
    
            }).catch((error) => {
                console.log("Token Error");
                console.error(error);
                props.setPaymentFormVisible(true)
                props.setPaymentFailed(true)
                props.setModalVisible(true);
            });
            setLoading(false);
            // Payment succeeded, navigate to success screen
        } catch (error) {
            console.log('Error processing payment:', error.message);
            setLoading(false);
            // Payment failed, display error message to customer
        }
        setLoading(false);
    };

    function setCardData(cardData,submit=false){
        setCardNumber();
        setExpMonth();
        setExpYear();
        setCvc();
        console.log(cardData)
        submit && handlePayPress(cardData.cardNumber,cardData.month,cardData.year,cardData.cvc);
    }
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Enter payment details</Text>
            <View style={styles.cardFieldContainer}>
                <CreditCardForm setCardData={setCardData} setPaymentFormVisible={props.setPaymentFormVisible}/>
                {/* <View>
                    <TextInput
                        placeholder="Card number"
                        value={cardNumber}
                        onChangeText={setCardNumber}
                    />
                    <TextInput
                        placeholder="Expiration month"
                        value={expMonth}
                        onChangeText={setExpMonth}
                    />
                    <TextInput
                        placeholder="Expiration year"
                        value={expYear}
                        onChangeText={setExpYear}
                    />
                    <TextInput
                        placeholder="CVC"
                        value={cvc}
                        onChangeText={setCvc}
                    />
                    <View style={styles.buttonContainer}>
                        <Button
                            title={loading ? "Loading..." : "Pay"}
                            // disabled={!cardDetails.complete || loading}
                            onPress={handlePayPress}
                        />
                    </View> 
                </View>*/}
                {/* <StripeProvider publishableKey="pk_test_51Mo6dSDHNZpdr5ANCCpFYACJtKVPZl7pSgHbljXGWnYjYTqBUJEtM2f73utw5hcemOFXyOAJmsSLmQqGlFojPWNP00hl8GUnkM">
                    <CardField
                        postalCodeEnabled={false}
                        style={styles.cardField}
                        onCardChange={handleCardDetailsChange}
                    />
                </StripeProvider> */}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        marginBottom: 24,
    },
    cardFieldContainer: {
        width: '100%',
        height: 50,
        marginVertical: 30,
    },
    cardField: {
        height: '100%',
        width: '100%',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 24,
    },
});
