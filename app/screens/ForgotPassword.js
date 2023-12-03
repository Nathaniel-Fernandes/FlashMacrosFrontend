// 3rd party
import React, { useState } from "react";
import { Text, View, Image, TextInput, Button, ScrollView } from "react-native";
import { Link } from "expo-router"

import * as EmailValidator from 'email-validator'

// local files
import { defaultColors } from '../../src/styles/styles';

const ForgotPassword = () => {
    const [email, setEmail] = useState('')

    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
            {/* Use "keyboardShouldPersistTaps='handled' with a <ScrollView> so clicks off the text-input will close the keyboard" */}
            <ScrollView style={{ marginTop: 60 }} keyboardShouldPersistTaps='handled'>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
                    <Image
                        source={require('../../assets/logo.png')}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 13
                        }}
                        alt="FlashMacros Logo"
                    />
                    <Text style={{ ...defaultColors.black, fontWeight: 800 }}>Flash Macros</Text>
                </View>

                <View style={{ marginHorizontal: 20, marginVertical: 25 }}>
                    <Text style={{ ...defaultColors.black, fontSize: 28, fontWeight: 800 }}>Password Reset</Text>
                    <Text style={{ ...defaultColors.black }}>Please enter the email associated with your account.</Text>

                    <View style={{ marginVertical: 20 }}>
                        <Text style={{ ...defaultColors.red, fontWeight: 800 }}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Your email address"
                            style={{
                                color: defaultColors.lightGray,
                                marginVertical: 15,
                                borderBottomColor: defaultColors.lightGray,
                                paddingBottom: 5,
                                borderBottomWidth: 1
                            }}
                        ></TextInput>
       
                                                {
                            (email != '' && !EmailValidator.validate(email)) ?
                                < Text style={{ color: defaultColors.red.color }}>Your email seems to be incorrect. Please try again.</Text> : ''
                        }
                    </View>

                    {/* TODO: send message to user that an email has been sent */}
                    {/* Navigate to the Sign In screen on button press */}
                    <Link
                        href={'/'}
                        asChild
                    >
                        <Button
                            title="Submit"
                            color={defaultColors.red.color}
                            disabled={email.length === 0 || !EmailValidator.validate(email)}
                        ></Button>
                    </Link>

                    <View style={{ marginVertical: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        {/* Enable user to navigate to Sign In screen in case they wish to sign in */}
                        <Link
                            href={'/'}
                            asChild
                        >
                            <Text style={{ ...defaultColors.darkGray, fontWeight: 800 }}>Sign In</Text>
                        </Link>

                        {/* Enable user to navigate to Sign Up screen in case they wish to sign up */}
                        <Link
                            href={'/screens/SignUpScreen'}
                        >
                            <Text style={{ ...defaultColors.red, fontWeight: 800 }}>Sign Up</Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default ForgotPassword